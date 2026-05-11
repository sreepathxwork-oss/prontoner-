import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame, extend } from '@react-three/fiber';
import { OrbitControls, Effects } from '@react-three/drei';
import { UnrealBloomPass } from 'three-stdlib';
import * as THREE from 'three';

extend({ UnrealBloomPass });

const ParticleSwarm = () => {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  // Reduced count for better performance on all devices
  const count = 8000; 
  const speedMult = 1;
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const target = useMemo(() => new THREE.Vector3(), []);
  const pColor = useMemo(() => new THREE.Color(), []);
  
  const positions = useMemo(() => {
     const pos: THREE.Vector3[] = [];
     for(let i=0; i<count; i++) pos.push(new THREE.Vector3((Math.random()-0.5)*100, (Math.random()-0.5)*100, (Math.random()-0.5)*100));
     return pos;
  }, []);

  // Material & Geom
  const material = useMemo(() => new THREE.MeshBasicMaterial({ color: 0xffffff }), []);
  const geometry = useMemo(() => new THREE.TetrahedronGeometry(0.2), []);

  const PARAMS = useMemo(() => ({"scale":60,"iter":4.5,"morph":0.84,"twist":1.2,"bright":1.06}), []);

  useFrame((state) => {
    if (!meshRef.current) return;
    const time = state.clock.getElapsedTime() * speedMult;

    const scale     = PARAMS.scale;
    const iter      = PARAMS.iter;
    const morphTime = PARAMS.morph;
    const twist     = PARAMS.twist;
    const brightness= PARAMS.bright;
    
    const tm   = time * morphTime;
    const tFast= time * 0.7;
    const tSlow= time * 0.13;
    
    const sinTm = Math.sin(tm * 0.4);
    const sinTm2 = Math.sin(tm * 0.4 + 2.094);
    const sinTm3 = Math.sin(tm * 0.4 + 4.188);

    const blend0 = Math.max(0, sinTm);
    const blend1 = Math.max(0, sinTm2);
    const blend2 = Math.max(0, sinTm3);
    
    const bSum = blend0 + blend1 + blend2 + 0.0001;
    const b0 = blend0 / bSum;
    const b1 = blend1 / bSum;
    const b2 = blend2 / bSum;

    const mScale = 2.2 + 0.4 * Math.sin(tSlow);
    const iterInt = Math.floor(iter);

    const jcx = 0.355 + 0.08*Math.sin(tSlow*1.3);
    const jcy = 0.355 + 0.08*Math.cos(tSlow*0.9);
    const jcz = 0.12  + 0.05*Math.sin(tSlow*1.7);

    for (let i = 0; i < count; i++) {
        const idx = i + 1;
        
        let hx = 0, hb = 0.5, hi = idx;
        while (hi > 0) { hx += (hi & 1) * hb; hi >>= 1; hb *= 0.5; }
        
        let hy = 0, hf3 = 1.0/3, hi3 = idx;
        while (hi3 > 0) { const r = hi3 % 3; hy += r * hf3; hi3 = Math.floor(hi3/3); hf3 /= 3; }
        
        let hz = 0, hf5 = 1.0/5, hi5 = idx;
        while (hi5 > 0) { const r = hi5 % 5; hz += r * hf5; hi5 = Math.floor(hi5/5); hf5 /= 5; }
        
        let sx = hx * 2 - 1;
        let sy = hy * 2 - 1;
        let sz = hz * 2 - 1;
        
        // Mandelbox
        let mx = sx, my = sy, mz = sz;
        const mFixed = 1.0;
        for (let k = 0; k < iter; k++) {
          mx = mx > mFixed  ?  2*mFixed - mx : mx < -mFixed ? -2*mFixed - mx : mx;
          my = my > mFixed  ?  2*mFixed - my : my < -mFixed ? -2*mFixed - my : my;
          mz = mz > mFixed  ?  2*mFixed - mz : mz < -mFixed ? -2*mFixed - mz : mz;
          const mr2 = mx*mx + my*my + mz*mz;
          const mFactor = mr2 < 0.25 ? 4.0 : mr2 < 1.0 ? 1.0/mr2 : 1.0;
          mx = mScale * mx * mFactor + sx;
          my = mScale * my * mFactor + sy;
          mz = mScale * mz * mFactor + sz;
        }
        const mLen = Math.sqrt(mx*mx+my*my+mz*mz)+0.001;
        const mNorm = Math.log(mLen+1) * 0.4;
        const mX = mx/mLen * mNorm;
        const mY = my/mLen * mNorm;
        const mZ = mz/mLen * mNorm;
        
        // Sierpinski
        let tx = sx, ty = sy, tz = sz;
        for (let k = 0; k < iterInt; k++) {
          let vx=1,vy=1,vz=1, best=-1e9;
          let d;
          d = tx+ty+tz;   if(d>best){best=d; vx=1; vy=1; vz=1;}
          d =-tx-ty+tz;   if(d>best){best=d; vx=-1;vy=-1;vz=1;}
          d =-tx+ty-tz;   if(d>best){best=d; vx=-1;vy=1; vz=-1;}
          d = tx-ty-tz;   if(d>best){best=d; vx=1; vy=-1;vz=-1;}
          tx = 2*tx - vx;
          ty = 2*ty - vy;
          tz = 2*tz - vz;
        }
        const tLen = Math.sqrt(tx*tx+ty*ty+tz*tz)+0.001;
        const tX = tx/tLen * 0.85;
        const tY = ty/tLen * 0.85;
        const tZ = tz/tLen * 0.85;
        
        // Julia
        let jx = sx*0.6, jy = sy*0.6, jz = sz*0.6, jw = 0.0;
        let jEscaped = 0.0;
        for (let k = 0; k < 8; k++) {
          const qx2 = jx*jx - jy*jy - jz*jz - jw*jw + jcx;
          const qy2 = 2*jx*jy + jcy;
          const qz2 = 2*jx*jz + jcz;
          const qw2 = 2*jx*jw;
          jx=qx2; jy=qy2; jz=qz2; jw=qw2;
          const jR2 = jx*jx+jy*jy+jz*jz+jw*jw;
          jEscaped += 1.0 / (1.0 + jR2*0.5);
          if (jR2 > 16.0) break;
        }
        const jLen = Math.sqrt(jx*jx+jy*jy+jz*jz)+0.001;
        const jFade = jEscaped / 8.0;
        const jX = jx/jLen * jFade;
        const jY = jy/jLen * jFade;
        const jZ = jz/jLen * jFade;
        
        let fx = b0*mX + b1*tX + b2*jX;
        let fy = b0*mY + b1*tY + b2*jY;
        let fz = b0*mZ + b1*tZ + b2*jZ;
        
        const twistAngle = fy * twist * 0.15 + tFast * 0.2;
        const twCos = Math.cos(twistAngle);
        const twSin = Math.sin(twistAngle);
        const twx = fx*twCos - fz*twSin;
        const twz = fx*twSin + fz*twCos;
        fx = twx; fz = twz;
        
        const fDist = Math.sqrt(fx*fx+fy*fy+fz*fz)+0.001;
        const breathe = 1.0 + 0.06 * Math.sin(fDist * 4.5 - tFast * 2.1);
        
        target.set(fx * scale * breathe, fy * scale * breathe, fz * scale * breathe);
        
        const hMandelbox   = 0.58 + 0.12 * Math.sin(mNorm * 3.0 + tSlow);
        const hSierpinski  = 0.08 + 0.07 * Math.sin(tLen  * 4.0 + tFast);
        const hJulia       = 0.75 + 0.15 * jFade + 0.05 * Math.sin(tSlow*2);
        
        const hue = (b0*hMandelbox + b1*hSierpinski + b2*hJulia + tSlow*0.04) % 1.0;
        const boundaryProx = Math.abs(Math.sin(fDist * 6.28));
        const sat = 0.65 + 0.35 * boundaryProx;
        const interior = 1.0 - Math.min(1.0, fDist * 1.2);
        const lum = brightness * (0.15 + 0.55 * boundaryProx + 0.2 * interior);
        
        pColor.setHSL(hue, sat, Math.min(0.95, lum));
        
        positions[i].lerp(target, 0.1);
        dummy.position.copy(positions[i]);
        dummy.updateMatrix();
        meshRef.current.setMatrixAt(i, dummy.matrix);
        meshRef.current.setColorAt(i, pColor);
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
    if (meshRef.current.instanceColor) meshRef.current.instanceColor.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[geometry, material, count]} />
  );
};

export const ThreeBackground = () => {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none bg-black overflow-hidden">
      {/* Blur Layer */}
      <div className="absolute inset-0 blur-[8px] scale-110">
        <Canvas camera={{ position: [0, 0, 100], fov: 60 }}>
          <fog attach="fog" args={['#000000', 0.01]} />
          <ParticleSwarm />
          <OrbitControls autoRotate={true} enableZoom={false} enablePan={false} enableRotate={false} />
          <Effects disableGamma>
              {/* @ts-ignore */}
              <unrealBloomPass args={[undefined, 1.8, 0.4, 0]} />
          </Effects>
        </Canvas>
      </div>
      
      {/* Professional Vignette Overlay */}
      <div className="absolute inset-0 z-10 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.4)_100%)]" />
      <div className="absolute inset-0 z-10 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_40%,rgba(11,5,16,0.2)_100%)]" />
    </div>
  );
};
