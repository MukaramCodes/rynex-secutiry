import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { db } from '@/lib/db';
import { getSessionUser } from '@/lib/auth';
import { hashPassword } from '@/lib/password';
import { sendConfirmationEmail } from '@/lib/mailer';
import { buildPortalCredentialsEmail } from '@/lib/email-templates/portal-credentials';

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: targetUserId } = await params;
    const cookieStore = await cookies();
    const session = await getSessionUser(cookieStore);

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { role: creatorRole, userId: creatorId } = session;

    // Check permissions
    if (creatorRole !== 'CEO' && creatorRole !== 'ADMIN' && creatorRole !== 'DEVELOPER') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const { name, role, teamId, isActive, resetPassword, originalEmail, joiningDate, probationStart, probationEnd } = body;

    // Retrieve target user
    const targetUser = await db.user.findUnique({ where: { id: targetUserId } });
    if (!targetUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // CEO cannot be modified by anyone except CEO themselves
    if (targetUser.role === 'CEO' && creatorRole !== 'CEO') {
      return NextResponse.json({ error: 'Cannot modify CEO account' }, { status: 403 });
    }

    const updateData: any = {};
    const auditDetails: string[] = [];

    if (name !== undefined) {
      updateData.name = name;
      auditDetails.push(`Name: ${targetUser.name} -> ${name}`);
    }

    if (role !== undefined) {
      // Non-CEO cannot change user to CEO
      if (role === 'CEO' && creatorRole !== 'CEO') {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
      }
      updateData.role = role;
      auditDetails.push(`Role: ${targetUser.role} -> ${role}`);
    }

    if (teamId !== undefined) {
      updateData.teamId = teamId || null;
      auditDetails.push(`TeamId: ${targetUser.teamId} -> ${teamId}`);
    }

    if (isActive !== undefined) {
      updateData.isActive = isActive;
      auditDetails.push(`Active: ${targetUser.isActive} -> ${isActive}`);
    }

    if (originalEmail !== undefined) {
      updateData.originalEmail = originalEmail || null;
      auditDetails.push(`OriginalEmail: ${targetUser.originalEmail} -> ${originalEmail}`);
    }

    if (joiningDate !== undefined) {
      updateData.joiningDate = joiningDate ? new Date(joiningDate) : null;
      auditDetails.push(`JoiningDate: ${targetUser.joiningDate} -> ${joiningDate}`);
    }

    if (probationStart !== undefined) {
      updateData.probationStart = probationStart ? new Date(probationStart) : null;
      auditDetails.push(`ProbationStart: ${targetUser.probationStart} -> ${probationStart}`);
    }

    if (probationEnd !== undefined) {
      updateData.probationEnd = probationEnd ? new Date(probationEnd) : null;
      auditDetails.push(`ProbationEnd: ${targetUser.probationEnd} -> ${probationEnd}`);
    }

    // Handle Password Reset
    if (resetPassword) {
      const hashed = await hashPassword(resetPassword);
      updateData.passwordHash = hashed;
      updateData.mustChangePassword = true;
      auditDetails.push('Password Reset initiated');

      // Send email with new password
      const emailTemplate = buildPortalCredentialsEmail(
        targetUser.name,
        targetUser.email,
        resetPassword
      );
      try {
        const sendToEmail = originalEmail || targetUser.originalEmail || targetUser.email;
        await sendConfirmationEmail(sendToEmail, 'Your Rynex Password has been Reset', emailTemplate.html);
      } catch (emailErr) {
        console.error('Failed to send password reset email:', emailErr);
      }
    }

    // Perform Update
    const updated = await db.user.update({
      where: { id: targetUserId },
      data: updateData,
    });

    // Write Audit Log
    await db.auditLog.create({
      data: {
        userId: creatorId,
        action: 'UPDATE_USER',
        entityType: 'User',
        entityId: targetUserId,
        details: `Updated user ${targetUser.name}. Changes: ${auditDetails.join(', ')}`,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'User updated successfully',
      user: {
        id: updated.id,
        name: updated.name,
        email: updated.email,
        role: updated.role,
        isActive: updated.isActive,
      },
    });
  } catch (error: any) {
    console.error('Error updating user:', error);
    return NextResponse.json(
      { error: 'An error occurred while updating user' },
      { status: 500 }
    );
  }
}
