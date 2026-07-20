'use client';

import React, { useEffect, useRef, useState } from 'react';

export default function SecurityAudioControl() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.2); // Default volume 20%
  const [showSlider, setShowSlider] = useState(false);

  const audioCtxRef = useRef<AudioContext | null>(null);
  
  // Node refs
  const gainNodeRef = useRef<GainNode | null>(null);
  const humOsc1Ref = useRef<OscillatorNode | null>(null);
  const humOsc2Ref = useRef<OscillatorNode | null>(null);
  const noiseNodeRef = useRef<AudioBufferSourceNode | null>(null);
  const lfoRef = useRef<OscillatorNode | null>(null);
  
  // Timer ref for diagnostics chirps
  const chirpIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Read saved settings on mount
  useEffect(() => {
    const savedMute = localStorage.getItem('security_audio_muted');
    const savedVol = localStorage.getItem('security_audio_volume');
    
    if (savedVol) {
      setVolume(parseFloat(savedVol));
    }
    
    // Autoplay warning: Browsers require interaction. We start in "paused/muted" state
    // unless they already unmuted previously, but we still need user interaction to activate.
    if (savedMute === 'false') {
      setIsPlaying(false); // User must click once to activate AudioContext
    }
  }, []);

  const initAudio = () => {
    if (audioCtxRef.current) return;

    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;

    const ctx = new AudioContextClass();
    audioCtxRef.current = ctx;

    // 1. Create Main Gain Node
    const mainGain = ctx.createGain();
    mainGain.gain.setValueAtTime(volume, ctx.currentTime);
    mainGain.connect(ctx.destination);
    gainNodeRef.current = mainGain;

    // 2. Create Low-Frequency Hum (55Hz and 110Hz oscillators)
    const osc1 = ctx.createOscillator();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(55, ctx.currentTime); // Deep hum

    const osc2 = ctx.createOscillator();
    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(110, ctx.currentTime); // Harmonic richness

    // Lowpass filter for hum
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(120, ctx.currentTime);
    filter.Q.setValueAtTime(1, ctx.currentTime);

    // Filter modulation LFO (creates breathing effect)
    const lfo = ctx.createOscillator();
    lfo.frequency.setValueAtTime(0.08, ctx.currentTime); // Very slow (0.08 Hz)
    const lfoGain = ctx.createGain();
    lfoGain.gain.setValueAtTime(40, ctx.currentTime); // Sweep between 80Hz and 160Hz
    
    lfo.connect(lfoGain);
    lfoGain.connect(filter.frequency);

    // Hum gain (quieter triangle, louder sine)
    const humGain1 = ctx.createGain();
    humGain1.gain.setValueAtTime(0.6, ctx.currentTime);
    const humGain2 = ctx.createGain();
    humGain2.gain.setValueAtTime(0.2, ctx.currentTime);

    osc1.connect(humGain1);
    osc2.connect(humGain2);

    humGain1.connect(filter);
    humGain2.connect(filter);
    filter.connect(mainGain);

    // 3. Create Server Fan Noise (filtered white noise)
    const bufferSize = ctx.sampleRate * 2; // 2 seconds of noise
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    const noiseSource = ctx.createBufferSource();
    noiseSource.buffer = noiseBuffer;
    noiseSource.loop = true;

    const noiseFilter = ctx.createBiquadFilter();
    noiseFilter.type = 'bandpass';
    noiseFilter.frequency.setValueAtTime(350, ctx.currentTime);
    noiseFilter.Q.setValueAtTime(0.5, ctx.currentTime);

    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(0.04, ctx.currentTime); // Faint background fan noise

    noiseSource.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(mainGain);

    // Start audio sources
    osc1.start(0);
    osc2.start(0);
    lfo.start(0);
    noiseSource.start(0);

    // Store refs
    humOsc1Ref.current = osc1;
    humOsc2Ref.current = osc2;
    lfoRef.current = lfo;
    noiseNodeRef.current = noiseSource;

    // Start periodic chirps
    startChirpInterval(ctx, mainGain);
  };

  // Periodic security diagnostics chirps
  const startChirpInterval = (ctx: AudioContext, destination: AudioNode) => {
    if (chirpIntervalRef.current) clearInterval(chirpIntervalRef.current);

    chirpIntervalRef.current = setInterval(() => {
      if (ctx.state === 'suspended') return;

      // diagnostic beep synthesizer
      const time = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(950, time);
      osc.frequency.exponentialRampToValueAtTime(750, time + 0.15); // Descending chirp

      gain.gain.setValueAtTime(0.0, time);
      gain.gain.linearRampToValueAtTime(0.02, time + 0.02); // fade in fast
      gain.gain.exponentialRampToValueAtTime(0.0001, time + 0.15); // fade out fast

      osc.connect(gain);
      gain.connect(destination);

      osc.start(time);
      osc.stop(time + 0.16);
    }, 18000); // play every 18 seconds
  };

  const handleTogglePlay = async () => {
    if (!audioCtxRef.current) {
      initAudio();
    }

    const ctx = audioCtxRef.current;
    if (!ctx) return;

    if (isPlaying) {
      // Mute audio by ramping gain node to 0
      gainNodeRef.current?.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.1);
      setTimeout(() => {
        if (gainNodeRef.current?.gain.value === 0.0001) {
          ctx.suspend();
        }
      }, 150);
      setIsPlaying(false);
      localStorage.setItem('security_audio_muted', 'true');
    } else {
      // Unmute/Resume
      if (ctx.state === 'suspended') {
        await ctx.resume();
      }
      gainNodeRef.current?.gain.setValueAtTime(0.0001, ctx.currentTime);
      gainNodeRef.current?.gain.exponentialRampToValueAtTime(volume, ctx.currentTime + 0.2);
      setIsPlaying(true);
      localStorage.setItem('security_audio_muted', 'false');
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVol = parseFloat(e.target.value);
    setVolume(newVol);
    localStorage.setItem('security_audio_volume', newVol.toString());

    if (isPlaying && gainNodeRef.current && audioCtxRef.current) {
      gainNodeRef.current.gain.setValueAtTime(gainNodeRef.current.gain.value, audioCtxRef.current.currentTime);
      gainNodeRef.current.gain.exponentialRampToValueAtTime(Math.max(0.0001, newVol), audioCtxRef.current.currentTime + 0.05);
    }
  };

  // Clean up nodes on unmount
  useEffect(() => {
    return () => {
      if (chirpIntervalRef.current) clearInterval(chirpIntervalRef.current);
      
      try {
        humOsc1Ref.current?.stop();
        humOsc2Ref.current?.stop();
        lfoRef.current?.stop();
        noiseNodeRef.current?.stop();
        audioCtxRef.current?.close();
      } catch (err) {
        // ignore errors on quick unmounts
      }
    };
  }, []);

  return (
    <div 
      className="audio-control-container"
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        marginRight: '16px',
        padding: '6px 10px',
        borderRadius: '6px',
        backgroundColor: 'rgba(0, 0, 0, 0.03)',
        border: '1px solid rgba(0, 0, 0, 0.05)',
        position: 'relative',
        zIndex: 10,
      }}
      onMouseEnter={() => setShowSlider(true)}
      onMouseLeave={() => setShowSlider(false)}
    >
      <button
        onClick={handleTogglePlay}
        title={isPlaying ? 'Mute Security Sound' : 'Play Security Sound'}
        style={{
          background: 'none',
          border: 'none',
          color: isPlaying ? 'var(--portal-teal)' : 'var(--portal-text-secondary)',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '15px',
          width: '28px',
          height: '28px',
          borderRadius: '50%',
          transition: 'all 0.2s ease',
          backgroundColor: isPlaying ? 'var(--portal-teal-light)' : 'rgba(0, 0, 0, 0.02)',
        }}
      >
        <i className={isPlaying ? 'fas fa-volume-up' : 'fas fa-volume-mute'} />
      </button>

      {/* Slide-out Volume Bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          width: showSlider ? '70px' : '0px',
          opacity: showSlider ? 1 : 0,
          overflow: 'hidden',
          transition: 'all 0.2s ease',
        }}
      >
        <input
          type="range"
          min="0.01"
          max="0.8"
          step="0.02"
          value={volume}
          onChange={handleVolumeChange}
          style={{
            width: '60px',
            height: '4px',
            WebkitAppearance: 'none',
            background: 'var(--portal-border)',
            outline: 'none',
            borderRadius: '2px',
            cursor: 'pointer',
          }}
        />
      </div>
      
      {isPlaying && (
        <span 
          style={{
            fontSize: '9px',
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            color: 'var(--portal-teal)',
            animation: 'pulse 1.5s infinite alternate',
          }}
        >
          Sec Hum
        </span>
      )}
      
      <style jsx global>{`
        @keyframes pulse {
          0% { opacity: 0.4; }
          100% { opacity: 1; }
        }
      `}</style>
    </div>
  );
}
