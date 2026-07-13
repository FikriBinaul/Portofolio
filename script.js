(function(){
'use strict';
var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
var isTouch = window.matchMedia('(hover:none), (pointer:coarse)').matches;
var clamp = function(v,a,b){ return Math.max(a,Math.min(b,v)); };
var lerp = function(a,b,t){ return a+(b-a)*t; };

/* ============================================================
   LOADER — boot sequence
   ============================================================ */
function runLoader(done){
  var lines = [
    'booting kernel...',
    'mounting embedded_systems.drv',
    'linking iot_stack.so',
    'calibrating sensors...',
    'compiling engineer_profile.sh',
    'ready.'
  ];
  var lineEl = document.getElementById('loaderLine');
  var fillEl = document.getElementById('loaderFill');
  var loader = document.getElementById('loader');

  if(reduceMotion){
    loader.classList.add('hidden');
    done();
    return;
  }

  var i = 0;
  function step(){
    if(i < lines.length){
      lineEl.textContent = lines[i];
      fillEl.style.width = Math.round(((i+1)/lines.length)*100) + '%';
      i++;
      setTimeout(step, 260);
    } else {
      setTimeout(function(){
        loader.classList.add('hidden');
        setTimeout(done, 500);
      }, 260);
    }
  }
  setTimeout(step, 300);
}

/* ============================================================
   CUSTOM CURSOR
   ============================================================ */
function initCursor(){
  if(isTouch) return;
  var dot = document.getElementById('cursorDot');
  var ring = document.getElementById('cursorRing');
  var mx = window.innerWidth/2, my = window.innerHeight/2;
  var rx = mx, ry = my;

  window.addEventListener('mousemove', function(e){
    mx = e.clientX; my = e.clientY;
    dot.style.transform = 'translate('+mx+'px,'+my+'px) translate(-50%,-50%)';
    document.documentElement.style.setProperty('--mx', mx+'px');
    document.documentElement.style.setProperty('--my', my+'px');
  });

  function raf(){
    rx = lerp(rx, mx, 0.16);
    ry = lerp(ry, my, 0.16);
    ring.style.transform = 'translate('+rx+'px,'+ry+'px) translate(-50%,-50%)';
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);

  var hoverables = 'a, button, .p-card, .cert-card, .terminal-window, .leadership-card, .orbit-item, .t-item, input, textarea, [tabindex]';
  document.addEventListener('mouseover', function(e){
    if(e.target.closest && e.target.closest(hoverables)) ring.classList.add('active');
  });
  document.addEventListener('mouseout', function(e){
    if(e.target.closest && e.target.closest(hoverables)) ring.classList.remove('active');
  });
}

/* ============================================================
   HERO — circuit-line background (canvas)
   ============================================================ */
function initCircuit(){
  var canvas = document.getElementById('circuit-canvas');
  var ctx = canvas.getContext('2d');
  var hero = document.getElementById('hero');
  var w,h,dpr;
  var nodes = [];
  var mouse = { x:-9999, y:-9999 };
  var parallax = { x:0, y:0 };
  var NODE_COUNT;

  function resize(){
    w = hero.clientWidth; h = hero.clientHeight;
    dpr = Math.min(window.devicePixelRatio||1, 2);
    canvas.width = w*dpr; canvas.height = h*dpr;
    canvas.style.width = w+'px'; canvas.style.height = h+'px';
    ctx.setTransform(dpr,0,0,dpr,0,0);
    NODE_COUNT = Math.round((w*h)/26000);
    NODE_COUNT = clamp(NODE_COUNT, 26, 70);
    nodes = [];
    for(var i=0;i<NODE_COUNT;i++){
      nodes.push({
        x: Math.random()*w, y: Math.random()*h,
        vx: (Math.random()-0.5)*0.18, vy:(Math.random()-0.5)*0.18,
        r: Math.random()*1.6+0.8,
        phase: Math.random()*Math.PI*2
      });
    }
  }
  resize();
  window.addEventListener('resize', resize);

  hero.addEventListener('mousemove', function(e){
    var rect = hero.getBoundingClientRect();
    mouse.x = e.clientX - rect.left; mouse.y = e.clientY - rect.top;
    parallax.x = ((mouse.x/w)-0.5) * 18;
    parallax.y = ((mouse.y/h)-0.5) * 18;
  });
  hero.addEventListener('mouseleave', function(){ mouse.x=-9999; mouse.y=-9999; parallax.x=0; parallax.y=0; });

  var t = 0;
  function draw(){
    t += 0.016;
    ctx.clearRect(0,0,w,h);
    ctx.save();
    ctx.translate(parallax.x, parallax.y);

    for(var i=0;i<nodes.length;i++){
      var n = nodes[i];
      n.x += n.vx; n.y += n.vy;
      var dx = n.x-mouse.x, dy = n.y-mouse.y;
      var dist = Math.sqrt(dx*dx+dy*dy);
      if(dist < 110){
        var f = (110-dist)/110;
        n.x += (dx/(dist||1)) * f * 1.1;
        n.y += (dy/(dist||1)) * f * 1.1;
      }
      if(n.x<0) n.x=w; if(n.x>w) n.x=0;
      if(n.y<0) n.y=h; if(n.y>h) n.y=0;
    }

    for(var i=0;i<nodes.length;i++){
      for(var j=i+1;j<nodes.length;j++){
        var a=nodes[i], b=nodes[j];
        var dx=a.x-b.x, dy=a.y-b.y;
        var d = Math.sqrt(dx*dx+dy*dy);
        if(d < 150){
          ctx.strokeStyle = 'rgba(63,224,208,'+ (0.12*(1-d/150)) +')';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(a.x,a.y); ctx.lineTo(b.x,b.y);
          ctx.stroke();
        }
      }
    }

    for(var i=0;i<nodes.length;i++){
      var n = nodes[i];
      var pulse = 0.6 + Math.sin(t*1.4 + n.phase)*0.4;
      var rad = n.r * (1 + pulse*0.5);
      var grad = ctx.createRadialGradient(n.x,n.y,0,n.x,n.y,rad*5);
      grad.addColorStop(0, 'rgba(63,224,208,'+(0.55*pulse)+')');
      grad.addColorStop(1, 'rgba(63,224,208,0)');
      ctx.fillStyle = grad;
      ctx.beginPath(); ctx.arc(n.x,n.y,rad*5,0,Math.PI*2); ctx.fill();
      ctx.fillStyle = 'rgba(234,240,247,'+(0.7*pulse+0.2)+')';
      ctx.beginPath(); ctx.arc(n.x,n.y,rad,0,Math.PI*2); ctx.fill();
    }
    ctx.restore();

    if(!reduceMotion) requestAnimationFrame(draw);
  }
  draw();
}

/* ============================================================
   HERO — floating 3D signal core (Three.js)
   A wireframe icosahedral "core" with an inner AI lattice,
   orbiting data nodes, and PCB-trace rings — reacts gently to
   the cursor and idles into a slow autonomous spin.
   ============================================================ */
function initHero3D(){
  var canvas = document.getElementById('hero3d-canvas');
  var hero = document.getElementById('hero');
  if(!canvas || !hero || typeof THREE === 'undefined') return;

  var w = hero.clientWidth, h = hero.clientHeight;
  var renderer;
  try{
    renderer = new THREE.WebGLRenderer({ canvas:canvas, alpha:true, antialias:true });
  } catch(err){ return; }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,2));
  renderer.setSize(w,h);

  var scene = new THREE.Scene();
  var camera = new THREE.PerspectiveCamera(42, w/h, 0.1, 100);
  camera.position.set(0,0,8.6);

  var group = new THREE.Group();
  scene.add(group);

  var coreGeo = new THREE.IcosahedronGeometry(2.05, 1);
  var coreEdges = new THREE.EdgesGeometry(coreGeo);
  var coreMat = new THREE.LineBasicMaterial({ color:0x3fe0d0, transparent:true, opacity:0.55 });
  var core = new THREE.LineSegments(coreEdges, coreMat);
  group.add(core);

  var innerGeo = new THREE.IcosahedronGeometry(1.28, 0);
  var innerMat = new THREE.MeshBasicMaterial({ color:0x8b7fff, wireframe:true, transparent:true, opacity:0.4 });
  var innerMesh = new THREE.Mesh(innerGeo, innerMat);
  group.add(innerMesh);

  var ringGeo = new THREE.TorusGeometry(3.05, 0.004, 8, 96);
  var ringMat = new THREE.MeshBasicMaterial({ color:0x3fe0d0, transparent:true, opacity:0.16 });
  var ring1 = new THREE.Mesh(ringGeo, ringMat);
  ring1.rotation.x = Math.PI/2.4;
  group.add(ring1);
  var ring2 = new THREE.Mesh(ringGeo, new THREE.MeshBasicMaterial({ color:0x8b7fff, transparent:true, opacity:0.14 }));
  ring2.rotation.x = -Math.PI/2.7;
  ring2.rotation.y = Math.PI/3;
  group.add(ring2);

  var nodeCount = isTouch ? 6 : 11;
  var nodes = [];
  var nodeColors = [0xd89159, 0x3fe0d0, 0x8b7fff];
  for(var i=0;i<nodeCount;i++){
    var radius = 2.65 + Math.random()*1.35;
    var speed = 0.5 + Math.random()*0.7;
    var incl = Math.random()*Math.PI;
    var offset = Math.random()*Math.PI*2;
    var col = nodeColors[i % nodeColors.length];
    var m = new THREE.Mesh(new THREE.SphereGeometry(0.045+Math.random()*0.03, 8, 8), new THREE.MeshBasicMaterial({ color:col }));
    group.add(m);
    nodes.push({ mesh:m, radius:radius, speed:speed, incl:incl, offset:offset });
  }

  var particleCount = isTouch ? 60 : 150;
  var positions = new Float32Array(particleCount*3);
  for(var i=0;i<particleCount;i++){
    var r = 4.6 + Math.random()*3.6;
    var theta = Math.random()*Math.PI*2;
    var phi = Math.acos((Math.random()*2)-1);
    positions[i*3] = r*Math.sin(phi)*Math.cos(theta);
    positions[i*3+1] = r*Math.sin(phi)*Math.sin(theta);
    positions[i*3+2] = r*Math.cos(phi);
  }
  var particleGeo = new THREE.BufferGeometry();
  particleGeo.setAttribute('position', new THREE.BufferAttribute(positions,3));
  var particleMat = new THREE.PointsMaterial({ color:0xeaf0f7, size:0.02, transparent:true, opacity:0.32 });
  var particles = new THREE.Points(particleGeo, particleMat);
  group.add(particles);

  var targetRotX = 0, targetRotY = 0;
  hero.addEventListener('mousemove', function(e){
    var rect = hero.getBoundingClientRect();
    var mxN = ((e.clientX-rect.left)/rect.width) - 0.5;
    var myN = ((e.clientY-rect.top)/rect.height) - 0.5;
    targetRotY = mxN * 0.5;
    targetRotX = myN * 0.32;
  });
  hero.addEventListener('mouseleave', function(){ targetRotX = 0; targetRotY = 0; });

  function resize(){
    w = hero.clientWidth; h = hero.clientHeight;
    if(w===0||h===0) return;
    camera.aspect = w/h; camera.updateProjectionMatrix();
    renderer.setSize(w,h);
  }
  window.addEventListener('resize', resize);
  resize();

  var t = 0;
  var faded = false;
  function animate(){
    t += 0.006;
    core.rotation.y = t*0.6;
    core.rotation.x = t*0.22;
    innerMesh.rotation.y = -t*0.85;
    innerMesh.rotation.x = t*0.38;
    particles.rotation.y = t*0.06;

    for(var i=0;i<nodes.length;i++){
      var n = nodes[i];
      var a = t*n.speed + n.offset;
      n.mesh.position.set(
        Math.cos(a)*n.radius,
        Math.sin(a)*n.radius*Math.cos(n.incl),
        Math.sin(a)*n.radius*Math.sin(n.incl)
      );
    }

    group.rotation.y += (targetRotY - group.rotation.y)*0.04;
    group.rotation.x += (targetRotX - group.rotation.x)*0.04;

    renderer.render(scene, camera);
    if(!faded){ faded = true; canvas.classList.add('ready'); }
    if(!reduceMotion) requestAnimationFrame(animate);
  }
  animate();
  if(reduceMotion){ renderer.render(scene, camera); canvas.classList.add('ready'); }
}

/* ============================================================
   HERO — text reveal + role cycler
   ============================================================ */
function playHeroIntro(){
  var eyebrow = document.getElementById('heroEyebrow');
  var spans = document.querySelectorAll('.hero-title .line span');
  var roleCycler = document.getElementById('roleCycler');
  var scrollCue = document.getElementById('scrollCue');

  if(reduceMotion || typeof gsap === 'undefined'){
    // No animation library / reduced motion — content is already visible
    // by default (see CSS), just start the role cycler text.
    startRoleCycler();
    return;
  }

  // Only now opt into the "pre-animation" hidden state, right before
  // animating it back in — so if anything below throws, the hero
  // content was never actually hidden from the user.
  document.documentElement.classList.add('js-anim-ready');

  try{
    var tl = gsap.timeline();
    tl.to(eyebrow, { opacity:1, duration:0.6, ease:'power2.out' }, 0.1)
      .to(spans, { y:'0%', duration:1.1, ease:'expo.out', stagger:0.14 }, 0.35)
      .to(roleCycler, { opacity:1, duration:0.6 }, '-=0.35')
      .to(scrollCue, { opacity:1, duration:0.6 }, '-=0.3')
      .call(startRoleCycler);
  }catch(err){
    // Animation library misbehaved — drop back to the plain, fully
    // visible state instead of leaving the hero content stuck hidden.
    document.documentElement.classList.remove('js-anim-ready');
    startRoleCycler();
  }
}

function startRoleCycler(){
  var roles = ['Embedded Systems Engineer','IoT Engineer','AI Developer','Research Engineer','Robotics Enthusiast','Problem Solver'];
  var el = document.getElementById('role-text');
  if(!el) return;
  var idx = 0;

  if(reduceMotion){ el.textContent = roles[0]; return; }

  function typeRole(){
    var word = roles[idx];
    var ci = 0;
    (function typeChar(){
      el.textContent = word.slice(0, ci);
      ci++;
      if(ci <= word.length){
        setTimeout(typeChar, 42);
      } else {
        setTimeout(eraseRole, 1500);
      }
    })();
  }
  function eraseRole(){
    var word = roles[idx];
    var ci = word.length;
    (function eraseChar(){
      el.textContent = word.slice(0, ci);
      ci--;
      if(ci >= 0){
        setTimeout(eraseChar, 24);
      } else {
        idx = (idx+1) % roles.length;
        setTimeout(typeRole, 260);
      }
    })();
  }
  typeRole();
}

/* ============================================================
   SIGNAL SPINE — scroll progress
   ============================================================ */
function initSpine(){
  var wrap = document.querySelector('.spine-wrap');
  var fill = document.getElementById('spineFill');
  if(!wrap || !fill) return;
  var ticking = false;
  function update(){
    var rect = wrap.getBoundingClientRect();
    var total = rect.height - window.innerHeight;
    var passed = clamp(-rect.top, 0, total);
    var pct = total > 0 ? (passed/total)*100 : 0;
    fill.style.height = pct + '%';
    ticking = false;
  }
  window.addEventListener('scroll', function(){
    if(!ticking){ requestAnimationFrame(update); ticking = true; }
  });
  window.addEventListener('resize', update);
  update();
}

/* ============================================================
   NAV RAIL — active section indicator
   ============================================================ */
function initNavRail(){
  var links = document.querySelectorAll('.nav-rail a');
  if(!links.length) return;
  var map = {};
  links.forEach(function(l){ map[l.getAttribute('href').slice(1)] = l; });
  var sections = document.querySelectorAll('section[id]');
  var io = new IntersectionObserver(function(entries){
    entries.forEach(function(entry){
      var link = map[entry.target.id];
      if(!link) return;
      if(entry.isIntersecting){
        links.forEach(function(l){ l.classList.remove('active'); });
        link.classList.add('active');
      }
    });
  }, { rootMargin:'-45% 0px -45% 0px', threshold:0 });
  sections.forEach(function(s){ io.observe(s); });
}

/* ============================================================
   WHO AM I — terminal typing effect
   ============================================================ */
function initTerminal(){
  var body = document.getElementById('terminalBody');
  var reveal = document.getElementById('profileReveal');
  if(!body) return;

  var textSpan = document.createElement('span');
  textSpan.id = 'terminalText';
  var caret = document.createElement('span');
  caret.className = 'caret';
  body.appendChild(textSpan);
  body.appendChild(caret);

  var script = "> Initializing engineer profile...\n\n"
    + "Name: Fikri Binaul Umah\n"
    + "Education: Computer Engineering Technology, IPB University\n"
    + "Location: Bogor, Indonesia\n\n"
    + "Role: Embedded Systems, IoT & AI Engineer\n"
    + "Status: Open to research collaborations & engineering roles\n\n"
    + "Mission: Design intelligent systems that integrate\nembedded hardware, AI, IoT and cloud computing.\n\n"
    + "Core Stack: ESP32 · Python · OpenCV · Firebase · C/C++\n\n"
    + "Focus Areas:\n"
    + "  - Agriculture & Aquaculture IoT\n"
    + "  - Healthcare Sensing Systems\n"
    + "  - Computer Vision & Access Control\n\n"
    + "Passion: Research. Innovation. Automation.\n\n"
    + "> Profile loaded successfully.";

  var played = false;
  function play(){
    if(played) return;
    played = true;

    if(reduceMotion){
      textSpan.textContent = script;
      caret.style.display = 'none';
      if(reveal) reveal.classList.add('show');
      return;
    }

    var i = 0;
    (function type(){
    textSpan.textContent = script.slice(0, i++);
    if(i <= script.length){
        setTimeout(type, 2);
    }else{
        caret.style.display = 'none';
        if(reveal) reveal.classList.add('show');
    }
})();
  }

  var io = new IntersectionObserver(function(entries){
  entries.forEach(function(entry){
    if(entry.isIntersecting){
      play();
      io.unobserve(entry.target);
    }
  });
},{
  threshold:0.05,
  rootMargin:"0px 0px -15% 0px"
});
  io.observe(document.getElementById('who-am-i'));
    // Mobile fallback
  setTimeout(function () {
    if (window.innerWidth <= 768 && !played) {
      play();
    }
  }, 700);
}

/* ============================================================
   ENGINEERING JOURNEY — timeline reveal
   ============================================================ */
function initTimeline(){
  var items = document.querySelectorAll('.t-item');
  if(!items.length) return;
  if(reduceMotion){ items.forEach(function(i){ i.classList.add('in'); }); return; }
  var io = new IntersectionObserver(function(entries){
    entries.forEach(function(e){
      if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); }
    });
  }, { threshold:0.25 });
  items.forEach(function(i){ io.observe(i); });
}

/* ============================================================
   GENERIC SCROLL REVEAL
   ============================================================ */
function initReveal(){
  var items = document.querySelectorAll('.reveal');
  if(!items.length) return;
  if(reduceMotion){ items.forEach(function(i){ i.classList.add('in'); }); return; }
  var io = new IntersectionObserver(function(entries){
    entries.forEach(function(e){
      if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); }
    });
  }, { threshold:0.2 });
  items.forEach(function(i){ io.observe(i); });
}

/* ============================================================
   RESEARCH — plantar pressure heatmap
   ============================================================ */
function initPressureCanvas(){
  var canvas = document.getElementById('pressureCanvas');
  if(!canvas) return;
  var ctx = canvas.getContext('2d');
  var wrap = canvas.parentElement;
  var w,h,dpr;

  function resize(){
    w = wrap.clientWidth; h = wrap.clientHeight;
    dpr = Math.min(window.devicePixelRatio||1,2);
    canvas.width = w*dpr; canvas.height = h*dpr;
    canvas.style.width=w+'px'; canvas.style.height=h+'px';
    ctx.setTransform(dpr,0,0,dpr,0,0);
  }
  resize(); window.addEventListener('resize', resize);

  var points = [
    { fx:0.40, fy:0.22, amp:0.9, ph:0.0 },
    { fx:0.34, fy:0.55, amp:0.7, ph:1.1 },
    { fx:0.36, fy:0.82, amp:1.0, ph:2.0 },
    { fx:0.62, fy:0.20, amp:0.75, ph:0.6 },
    { fx:0.66, fy:0.52, amp:0.9, ph:1.6 },
    { fx:0.64, fy:0.80, amp:0.65, ph:2.4 }
  ];
  var colorAt = function(v){
    if(v < 0.5) return [63,224,208, v];
    if(v < 0.8) return [216,145,89, v];
    return [255,107,107, v];
  };

  var t = 0;
  function draw(){
    t += 0.012;
    ctx.clearRect(0,0,w,h);
    ctx.fillStyle = 'rgba(10,17,32,1)';
    ctx.fillRect(0,0,w,h);

    ctx.globalCompositeOperation = 'lighter';
    points.forEach(function(p){
      var v = clamp(0.35 + Math.sin(t*1.3+p.ph)*0.35*p.amp + 0.25, 0.1, 1);
      var x = p.fx*w, y = p.fy*h;
      var r = Math.min(w,h)*0.16;
      var c = colorAt(v);
      var grad = ctx.createRadialGradient(x,y,0,x,y,r);
      grad.addColorStop(0, 'rgba('+c[0]+','+c[1]+','+c[2]+','+(0.55*v)+')');
      grad.addColorStop(1, 'rgba('+c[0]+','+c[1]+','+c[2]+',0)');
      ctx.fillStyle = grad;
      ctx.beginPath(); ctx.arc(x,y,r,0,Math.PI*2); ctx.fill();
    });
    ctx.globalCompositeOperation = 'source-over';

    ctx.strokeStyle = 'rgba(148,168,199,0.18)';
    ctx.lineWidth = 1;
    [ [0.30,0.10,0.44,0.92], [0.56,0.08,0.72,0.90] ].forEach(function(f){
      ctx.beginPath();
      ctx.ellipse((f[0]+f[2])/2*w, (f[1]+f[3])/2*h, (f[2]-f[0])/2*w, (f[3]-f[1])/2*h, 0, 0, Math.PI*2);
      ctx.stroke();
    });

    if(!reduceMotion) requestAnimationFrame(draw); else return;
  }
  draw();
}

/* ============================================================
   RESEARCH — swarm aerator mesh
   ============================================================ */
function initSwarmCanvas(){
  var canvas = document.getElementById('swarmCanvas');
  if(!canvas) return;
  var ctx = canvas.getContext('2d');
  var wrap = canvas.parentElement;
  var w,h,dpr,units;

  function resize(){
    w = wrap.clientWidth; h = wrap.clientHeight;
    dpr = Math.min(window.devicePixelRatio||1,2);
    canvas.width = w*dpr; canvas.height = h*dpr;
    canvas.style.width=w+'px'; canvas.style.height=h+'px';
    ctx.setTransform(dpr,0,0,dpr,0,0);
    units = [];
    var n = 16;
    for(var i=0;i<n;i++){
      units.push({
        cx: Math.random()*w, cy: Math.random()*h,
        a: Math.random()*Math.PI*2,
        speed: 0.15+Math.random()*0.2,
        radius: 10+Math.random()*22
      });
    }
  }
  resize(); window.addEventListener('resize', resize);

  var t = 0;
  function draw(){
    t += 0.02;
    ctx.clearRect(0,0,w,h);
    ctx.fillStyle = 'rgba(9,15,28,1)';
    ctx.fillRect(0,0,w,h);

    ctx.strokeStyle = 'rgba(139,127,255,0.08)';
    for(var wl=0; wl<4; wl++){
      ctx.beginPath();
      for(var x=0;x<=w;x+=8){
        var y = h*(0.2+wl*0.22) + Math.sin(x*0.02 + t + wl)*6;
        if(x===0) ctx.moveTo(x,y); else ctx.lineTo(x,y);
      }
      ctx.stroke();
    }

    units.forEach(function(u){
      u.a += 0.003;
      u.x = u.cx + Math.cos(u.a*u.speed*6)*u.radius;
      u.y = u.cy + Math.sin(u.a*u.speed*6)*u.radius;
    });

    for(var i=0;i<units.length;i++){
      for(var j=i+1;j<units.length;j++){
        var a=units[i], b=units[j];
        var dx=a.x-b.x, dy=a.y-b.y;
        var d=Math.sqrt(dx*dx+dy*dy);
        if(d<95){
          ctx.strokeStyle = 'rgba(216,145,89,'+(0.18*(1-d/95))+')';
          ctx.beginPath(); ctx.moveTo(a.x,a.y); ctx.lineTo(b.x,b.y); ctx.stroke();
        }
      }
    }
    units.forEach(function(u){
      var pulse = 0.6+Math.sin(t*2+u.a)*0.4;
      ctx.fillStyle = 'rgba(139,127,255,'+(0.9)+')';
      ctx.beginPath(); ctx.arc(u.x,u.y,2.4,0,Math.PI*2); ctx.fill();
      ctx.strokeStyle = 'rgba(139,127,255,'+(0.35*pulse)+')';
      ctx.beginPath(); ctx.arc(u.x,u.y,6+pulse*3,0,Math.PI*2); ctx.stroke();
    });

    if(!reduceMotion) requestAnimationFrame(draw); else return;
  }
  draw();
}

/* ============================================================
   PROJECT CARDS — 3D tilt + cursor glow
   ============================================================ */
function initTiltCards(){
  if(isTouch) return;
  var cards = document.querySelectorAll('.p-card, .cert-card, .terminal-window, .leadership-card');
  cards.forEach(function(card){
    var strength = card.classList.contains('p-card') ? 13 : 8;
    card.style.transition = 'transform .6s var(--ease-out), border-color .4s var(--ease-out)';
    card.addEventListener('mousemove', function(e){
      var rect = card.getBoundingClientRect();
      var px = (e.clientX - rect.left)/rect.width;
      var py = (e.clientY - rect.top)/rect.height;
      var rotY = (px-0.5) * strength;
      var rotX = (0.5-py) * strength;
      card.style.transition = 'border-color .4s var(--ease-out)';
      card.style.transform = 'perspective(1000px) rotateX('+rotX+'deg) rotateY('+rotY+'deg) translateZ(6px)';
      card.style.setProperty('--px', (px*100)+'%');
      card.style.setProperty('--py', (py*100)+'%');
    });
    card.addEventListener('mouseleave', function(){
      card.style.transition = 'transform .6s var(--ease-out), border-color .4s var(--ease-out)';
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)';
    });
  });
}

/* ============================================================
   MAGNETIC BUTTONS
   ============================================================ */
function initMagnetic(){
  if(isTouch) return;
  var els = document.querySelectorAll('.magnetic');
  els.forEach(function(el){
    el.style.transition = 'transform .3s var(--ease-out)';
    el.addEventListener('mousemove', function(e){
      var rect = el.getBoundingClientRect();
      var mx = e.clientX - (rect.left+rect.width/2);
      var my = e.clientY - (rect.top+rect.height/2);
      el.style.transform = 'translate('+(mx*0.28)+'px,'+(my*0.28)+'px)';
    });
    el.addEventListener('mouseleave', function(){
      el.style.transform = 'translate(0,0)';
    });
  });
}

/* ============================================================
   TECH STACK — orbital galaxy
   ============================================================ */
function initGalaxy(){
  var wrap = document.getElementById('galaxyWrap');
  var o1 = document.getElementById('orbit1');
  var o2 = document.getElementById('orbit2');
  var tooltip = document.getElementById('galaxyTooltip');
  if(!wrap) return;

  var inner = [
    { name:'ESP32', desc:'Primary microcontroller — sensor fusion, wireless comms, low-power firmware.' },
    { name:'Arduino', desc:'Rapid prototyping for embedded logic and sensor testing.' },
    { name:'Python', desc:'Data pipelines, computer vision, and research tooling.' },
    { name:'Git', desc:'Version control across every embedded and research repo.' },
    { name:'MySQL', desc:'Relational storage for IoT telemetry and system logs.' }
  ];
  var outer = [
    { name:'Laravel', desc:'Backend APIs and admin dashboards for IoT platforms.' },
    { name:'Firebase', desc:'Realtime sync between devices, dashboards, and mobile.' },
    { name:'YOLO', desc:'Real-time object detection for vision-based monitoring.' },
    { name:'OpenCV', desc:'Image processing pipelines for research and CV projects.' },
    { name:'React', desc:'Interactive dashboards for sensor and telemetry data.' },
    { name:'Next.js', desc:'Production web apps and portfolio-grade interfaces.' }
  ];

  function buildRing(container, list, rx, ry){
    return list.map(function(item, idx){
      var el = document.createElement('div');
      el.className = 'orbit-item';
      el.tabIndex = 0;
      el.innerHTML = '<span>'+item.name+'</span>';
      el.setAttribute('data-desc', item.desc);
      el.setAttribute('aria-label', item.name+': '+item.desc);
      container.appendChild(el);
      return { el:el, angle:(idx/list.length)*Math.PI*2, rx:rx, ry:ry };
    });
  }

  var innerItems = buildRing(o1, inner, 0.46/2, 0.21/2);
  var outerItems = buildRing(o2, outer, 0.88/2, 0.38/2);
  var allItems = innerItems.concat(outerItems);

  function showTip(item){
    tooltip.innerHTML = '<b>'+item.el.querySelector('span').textContent+'</b> — '+item.el.getAttribute('data-desc');
    tooltip.classList.add('show');
  }
  function hideTip(){ tooltip.classList.remove('show'); }
  allItems.forEach(function(item){
    item.el.addEventListener('mouseenter', function(){ showTip(item); });
    item.el.addEventListener('mouseleave', hideTip);
    item.el.addEventListener('focus', function(){ showTip(item); });
    item.el.addEventListener('blur', hideTip);
  });

  function placeItem(it, size){
    it.x = Math.cos(it.angle)*size*it.rx;
    it.y = Math.sin(it.angle)*size*it.ry;
    var depth = (Math.sin(it.angle)+1)/2; /* 0 = far side, 1 = near side */
    var scale = 0.74 + depth*0.46;
    var opacity = 0.5 + depth*0.5;
    it.el.style.transform = 'translate('+it.x+'px,'+it.y+'px) scale('+scale.toFixed(3)+')';
    it.el.style.opacity = opacity.toFixed(2);
    it.el.style.zIndex = Math.round(depth*20);
  }
  function position(){
    var size = wrap.clientWidth;
    innerItems.forEach(function(it){ placeItem(it, size); });
    outerItems.forEach(function(it){ placeItem(it, size); });
  }
  position();
  window.addEventListener('resize', position);

  if(reduceMotion) return;
  function animate(){
    innerItems.forEach(function(it){ it.angle += 0.0032; });
    outerItems.forEach(function(it){ it.angle -= 0.0018; });
    position();
    requestAnimationFrame(animate);
  }
  requestAnimationFrame(animate);
}

/* ============================================================
   ACHIEVEMENTS — count-up
   ============================================================ */
function initCounters(){
  var nums = document.querySelectorAll('.achv-num');
  if(!nums.length) return;
  function animateNum(el){
    var target = parseFloat(el.getAttribute('data-target'));
    var suffix = el.getAttribute('data-suffix') || '';
    if(reduceMotion){ el.textContent = target+suffix; return; }
    var start = performance.now();
    var dur = 1500;
    function tick(now){
      var p = clamp((now-start)/dur, 0, 1);
      var eased = 1 - Math.pow(1-p, 3);
      el.textContent = Math.round(target*eased) + suffix;
      if(p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }
  var io = new IntersectionObserver(function(entries){
    entries.forEach(function(e){
      if(e.isIntersecting){ animateNum(e.target); io.unobserve(e.target); }
    });
  }, { threshold:0.6 });
  nums.forEach(function(n){ io.observe(n); });
}

/* ============================================================
   LEADERSHIP — expedition route illustration
   ============================================================ */
function initMountain(){
  var canvas = document.getElementById('mountainCanvas');
  if(!canvas) return;
  var ctx = canvas.getContext('2d');
  var wrap = canvas.parentElement;
  var w,h,dpr,route;

  function resize(){
    w = wrap.clientWidth; h = wrap.clientHeight;
    dpr = Math.min(window.devicePixelRatio||1,2);
    canvas.width = w*dpr; canvas.height = h*dpr;
    canvas.style.width=w+'px'; canvas.style.height=h+'px';
    ctx.setTransform(dpr,0,0,dpr,0,0);
    route = [
      [w*0.08,h*0.92],[w*0.22,h*0.78],[w*0.18,h*0.64],[w*0.34,h*0.52],
      [w*0.30,h*0.40],[w*0.48,h*0.28],[w*0.5,h*0.16]
    ];
  }
  resize(); window.addEventListener('resize', resize);

  function drawMountains(){
    ctx.fillStyle = 'rgba(10,17,32,1)';
    ctx.fillRect(0,0,w,h);

    var stars = 26;
    ctx.fillStyle = 'rgba(234,240,247,0.5)';
    for(var i=0;i<stars;i++){
      var sx = (i*97 % w), sy = (i*53 % (h*0.5));
      ctx.globalAlpha = 0.3+((i%5)/10);
      ctx.beginPath(); ctx.arc(sx, sy, 1, 0, Math.PI*2); ctx.fill();
    }
    ctx.globalAlpha = 1;

    function ridge(baseY, amp, color){
      ctx.beginPath();
      ctx.moveTo(0,h);
      ctx.lineTo(0, baseY);
      for(var x=0;x<=w;x+=w/10){
        ctx.lineTo(x, baseY - Math.sin(x*0.01+baseY)*amp - (x%2));
      }
      ctx.lineTo(w, baseY);
      ctx.lineTo(w,h); ctx.closePath();
      ctx.fillStyle = color;
      ctx.fill();
    }
    ridge(h*0.62, h*0.10, 'rgba(216,145,89,0.10)');
    ridge(h*0.76, h*0.14, 'rgba(148,168,199,0.10)');
    ridge(h*0.90, h*0.16, 'rgba(148,168,199,0.18)');
  }

  var t = 0;
  function draw(){
    t += 0.01;
    drawMountains();

    ctx.strokeStyle = 'rgba(63,224,208,0.5)';
    ctx.lineWidth = 2;
    ctx.setLineDash([6,7]);
    ctx.lineDashOffset = -t*40;
    ctx.beginPath();
    route.forEach(function(p,i){ i===0?ctx.moveTo(p[0],p[1]):ctx.lineTo(p[0],p[1]); });
    ctx.stroke();
    ctx.setLineDash([]);

    var travel = (Math.sin(t*0.6)*0.5+0.5) * (route.length-1);
    var idx = Math.floor(travel);
    var frac = travel - idx;
    var a = route[idx], b = route[Math.min(idx+1, route.length-1)];
    var px = lerp(a[0], b[0], frac), py = lerp(a[1], b[1], frac);
    var grad = ctx.createRadialGradient(px,py,0,px,py,14);
    grad.addColorStop(0,'rgba(63,224,208,0.9)');
    grad.addColorStop(1,'rgba(63,224,208,0)');
    ctx.fillStyle = grad;
    ctx.beginPath(); ctx.arc(px,py,14,0,Math.PI*2); ctx.fill();
    ctx.fillStyle = '#eaf0f7';
    ctx.beginPath(); ctx.arc(px,py,3,0,Math.PI*2); ctx.fill();

    var peak = route[route.length-1];
    ctx.strokeStyle = 'rgba(234,240,247,0.6)';
    ctx.beginPath(); ctx.moveTo(peak[0],peak[1]); ctx.lineTo(peak[0],peak[1]-16); ctx.stroke();
    ctx.fillStyle = 'rgba(216,145,89,0.85)';
    ctx.beginPath(); ctx.moveTo(peak[0],peak[1]-16); ctx.lineTo(peak[0]+12,peak[1]-11); ctx.lineTo(peak[0],peak[1]-6); ctx.closePath(); ctx.fill();

    if(!reduceMotion) requestAnimationFrame(draw); else return;
  }
  draw();
}

/* ============================================================
   CONTACT — three.js globe with connection arcs
   ============================================================ */
function initGlobe(){
  var container = document.querySelector('.globe-canvas-wrap');
  var canvas = document.getElementById('globeCanvas');
  if(!container || !canvas || typeof THREE === 'undefined') return;

  var w = container.clientWidth, h = container.clientHeight;
  var renderer = new THREE.WebGLRenderer({ canvas:canvas, alpha:true, antialias:true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,2));
  renderer.setSize(w,h);

  var scene = new THREE.Scene();
  var camera = new THREE.PerspectiveCamera(45, w/h, 0.1, 100);
  camera.position.set(0,0,7.2);

  var group = new THREE.Group();
  scene.add(group);

  var sphereGeo = new THREE.SphereGeometry(2.1, 24, 18);
  var sphereMat = new THREE.MeshBasicMaterial({ color:0x1a2438, wireframe:true, transparent:true, opacity:0.5 });
  var sphere = new THREE.Mesh(sphereGeo, sphereMat);
  group.add(sphere);

  var dotGeo = new THREE.SphereGeometry(2.06, 24, 18);
  var dotMat = new THREE.PointsMaterial({ color:0x3fe0d0, size:0.035, transparent:true, opacity:0.55 });
  var dots = new THREE.Points(dotGeo, dotMat);
  group.add(dots);

  function toVec(latDeg, lonDeg, r){
    var lat = latDeg*(Math.PI/180), lon = lonDeg*(Math.PI/180);
    return new THREE.Vector3(
      r*Math.cos(lat)*Math.cos(lon),
      r*Math.sin(lat),
      r*Math.cos(lat)*Math.sin(lon)
    );
  }

  var nodeCoords = [ [20,10],[35,-40],[-8,60],[48,120],[-20,-100],[10,170] ];
  var nodeMat = new THREE.MeshBasicMaterial({ color:0x8b7fff });
  nodeCoords.forEach(function(c){
    var p = toVec(c[0],c[1],2.12);
    var m = new THREE.Mesh(new THREE.SphereGeometry(0.045,8,8), nodeMat);
    m.position.copy(p);
    group.add(m);
  });

  var arcPairs = [ [0,1],[1,2],[2,3],[3,4],[4,5],[5,0] ];
  var arcLines = [];
  arcPairs.forEach(function(pair){
    var a = toVec(nodeCoords[pair[0]][0], nodeCoords[pair[0]][1], 2.12);
    var b = toVec(nodeCoords[pair[1]][0], nodeCoords[pair[1]][1], 2.12);
    var mid = a.clone().add(b).multiplyScalar(0.5);
    mid.setLength(2.12 + a.distanceTo(b)*0.42);
    var curve = new THREE.QuadraticBezierCurve3(a, mid, b);
    var pts = curve.getPoints(40);
    var geo = new THREE.BufferGeometry().setFromPoints(pts);
    var mat = new THREE.LineBasicMaterial({ color:0x3fe0d0, transparent:true, opacity:0.45 });
    var line = new THREE.Line(geo, mat);
    group.add(line);
    arcLines.push(line);
  });

  function resize(){
    w = container.clientWidth; h = container.clientHeight;
    if(w===0||h===0) return;
    camera.aspect = w/h; camera.updateProjectionMatrix();
    renderer.setSize(w,h);
  }
  window.addEventListener('resize', resize);
  resize();

  /* Drag-to-rotate: grab the globe and spin it, releases into inertia */
  var rotY = 0, rotX = 0, velY = 0, velX = 0;
  var isDragging = false, lastPX = 0, lastPY = 0;
  canvas.style.cursor = 'grab';
  canvas.style.touchAction = 'none';
  function pointerPos(e){ return e.touches ? e.touches[0] : e; }
  function dragStart(e){
    isDragging = true;
    canvas.style.cursor = 'grabbing';
    var p = pointerPos(e);
    lastPX = p.clientX; lastPY = p.clientY;
  }
  function dragMove(e){
    if(!isDragging) return;
    var p = pointerPos(e);
    var dx = p.clientX - lastPX, dy = p.clientY - lastPY;
    lastPX = p.clientX; lastPY = p.clientY;
    velY = dx*0.006; velX = dy*0.006;
    rotY += velY;
    rotX = clamp(rotX + velX, -0.7, 0.7);
    if(e.cancelable) e.preventDefault();
  }
  function dragEnd(){
    isDragging = false;
    canvas.style.cursor = 'grab';
  }
  canvas.addEventListener('mousedown', dragStart);
  window.addEventListener('mousemove', dragMove);
  window.addEventListener('mouseup', dragEnd);
  canvas.addEventListener('touchstart', dragStart, { passive:true });
  window.addEventListener('touchmove', dragMove, { passive:false });
  window.addEventListener('touchend', dragEnd);

  var t = 0;
  function animate(){
    t += 0.004;
    if(!isDragging){
      rotY += 0.004 + velY;
      velY *= 0.94;
      velX *= 0.94;
      rotX += velX + (0-rotX)*0.01;
    }
    group.rotation.y = rotY;
    group.rotation.x = rotX + Math.sin(t*0.4)*0.08;
    arcLines.forEach(function(line, i){
      line.material.opacity = 0.25 + Math.sin(t*3 + i)*0.2;
    });
    renderer.render(scene, camera);
    if(!reduceMotion) requestAnimationFrame(animate);
  }
  animate();
  if(reduceMotion){ renderer.render(scene, camera); }
}

/* ============================================================
   IMAGE FALLBACKS
   ============================================================ */
function initImageFallbacks(){
  var imgs = document.querySelectorAll('img');
  function svgFallback(label){
    var safeLabel = String(label || 'Image')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
    var svg = "<svg xmlns='http://www.w3.org/2000/svg' width='1200' height='700'>"
      + "<defs><linearGradient id='g' x1='0' x2='1' y1='0' y2='1'>"
      + "<stop offset='0%' stop-color='#0a1120'/>"
      + "<stop offset='100%' stop-color='#18253a'/>"
      + "</linearGradient></defs>"
      + "<rect width='100%' height='100%' fill='url(#g)'/>"
      + "<text x='50%' y='50%' fill='#eaf0f7' font-family='Inter,Arial,sans-serif' font-size='36' text-anchor='middle'>"
      + safeLabel
      + "</text></svg>";
    return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
  }
  imgs.forEach(function(img){
    img.addEventListener('error', function(){
      var fb = img.getAttribute('data-fallback');
      if(fb && img.src !== fb){
        img.src = fb;
        return;
      }
      var generated = svgFallback(img.alt || 'Photo');
      if(img.src !== generated){
        img.src = generated;
      }
    });
  });
}

/* ============================================================
   MOBILE NAVIGATION — hamburger overlay
   ============================================================ */
function initMobileNav(){
  var toggle = document.getElementById('mobileNavToggle');
  var overlay = document.getElementById('mobileNavOverlay');
  if(!toggle || !overlay) return;
  var links = overlay.querySelectorAll('a');

  function openMenu(){
    toggle.classList.add('open');
    overlay.classList.add('open');
    toggle.setAttribute('aria-expanded','true');
    document.body.style.overflow = 'hidden';
  }
  function closeMenu(){
    toggle.classList.remove('open');
    overlay.classList.remove('open');
    toggle.setAttribute('aria-expanded','false');
    document.body.style.overflow = '';
  }
  toggle.addEventListener('click', function(){
    if(overlay.classList.contains('open')) closeMenu(); else openMenu();
  });
  links.forEach(function(l){ l.addEventListener('click', closeMenu); });
  overlay.addEventListener('click', function(e){ if(e.target === overlay) closeMenu(); });
  document.addEventListener('keydown', function(e){
    if(e.key === 'Escape' && overlay.classList.contains('open')) closeMenu();
  });

  var sectionMap = {};
  links.forEach(function(l){ sectionMap[l.getAttribute('href').slice(1)] = l; });
  var sections = document.querySelectorAll('section[id]');
  var io = new IntersectionObserver(function(entries){
    entries.forEach(function(entry){
      var link = sectionMap[entry.target.id];
      if(!link) return;
      if(entry.isIntersecting){
        links.forEach(function(l){ l.classList.remove('active'); });
        link.classList.add('active');
      }
    });
  }, { rootMargin:'-45% 0px -45% 0px', threshold:0 });
  sections.forEach(function(s){ io.observe(s); });
}

/* ============================================================
   BACK TO TOP
   ============================================================ */
function initBackToTop(){
  var btn = document.getElementById('backToTop');
  if(!btn) return;
  function onScroll(){
    if(window.scrollY > window.innerHeight*0.7) btn.classList.add('show');
    else btn.classList.remove('show');
  }
  window.addEventListener('scroll', onScroll, { passive:true });
  onScroll();
  btn.addEventListener('click', function(){
    window.scrollTo({ top:0, behavior: reduceMotion ? 'auto' : 'smooth' });
  });
}

/* ============================================================
   PROJECT FILTER
   ============================================================ */
function initProjectFilter(){
  var bar = document.getElementById('projectFilter');
  if(!bar) return;
  var btns = bar.querySelectorAll('.filter-btn');
  var cards = document.querySelectorAll('#projectsGrid .p-card');
  btns.forEach(function(btn){
    btn.addEventListener('click', function(){
      btns.forEach(function(b){ b.classList.remove('active'); });
      btn.classList.add('active');
      var f = btn.getAttribute('data-filter');
      cards.forEach(function(card){
        var match = (f === 'all') || (card.getAttribute('data-cat') === f);
        card.style.transition = 'opacity .5s var(--ease-out), transform .5s var(--ease-out)';
        if(match){
          card.style.display = '';
          requestAnimationFrame(function(){ card.classList.remove('filtered-out'); });
        } else {
          card.classList.add('filtered-out');
          setTimeout(function(){
            if(card.classList.contains('filtered-out')) card.style.display = 'none';
          }, 500);
        }
      });
    });
  });
}

/* ============================================================
   CERTIFICATE LIGHTBOX
   ============================================================ */
function initCertModal(){
  var backdrop = document.getElementById('certModalBackdrop');
  if(!backdrop) return;
  var imgEl = document.getElementById('certModalImg');
  var catEl = document.getElementById('certModalCat');
  var titleEl = document.getElementById('certModalTitle');
  var issuerEl = document.getElementById('certModalIssuer');
  var dateEl = document.getElementById('certModalDate');
  var linkEl = document.getElementById('certModalLink');
  var closeBtn = document.getElementById('certModalClose');
  var cards = document.querySelectorAll('.cert-card');
  var lastFocused = null;

  function openModal(card){
    var img = card.querySelector('.cert-thumb img');
    var cat = card.querySelector('.cert-cat');
    var title = card.querySelector('.cert-title');
    var issuer = card.querySelector('.cert-issuer');
    var date = card.querySelector('.cert-date');
    if(img){ imgEl.src = img.currentSrc || img.src; imgEl.alt = img.alt; }
    if(cat) catEl.textContent = cat.textContent;
    if(title) titleEl.textContent = title.textContent;
    if(issuer) issuerEl.textContent = issuer.textContent;
    if(date) dateEl.textContent = date.textContent;
    linkEl.href = (img && (img.currentSrc || img.src)) || card.getAttribute('href');
    lastFocused = document.activeElement;
    backdrop.classList.add('open');
    document.body.style.overflow = 'hidden';
    closeBtn.focus();
  }
  function closeModal(){
    backdrop.classList.remove('open');
    document.body.style.overflow = '';
    if(lastFocused && lastFocused.focus) lastFocused.focus();
  }
  cards.forEach(function(card){
    card.addEventListener('click', function(e){
      e.preventDefault();
      openModal(card);
    });
  });
  closeBtn.addEventListener('click', closeModal);
  backdrop.addEventListener('click', function(e){ if(e.target === backdrop) closeModal(); });
  document.addEventListener('keydown', function(e){
    if(e.key === 'Escape' && backdrop.classList.contains('open')) closeModal();
  });
}

/* ============================================================
   AMBIENT SIGNAL BACKGROUND — whole-page drifting node network,
   themed like a live PCB / telemetry mesh, sits behind everything
   ============================================================ */
function initBgSignal(){
  var canvas = document.getElementById('bgSignalCanvas');
  if(!canvas) return;
  var ctx = canvas.getContext('2d');
  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var w, h, dpr = Math.min(window.devicePixelRatio || 1, 2);
  var nodes = [];
  var COUNT;

  function resize(){
    w = window.innerWidth; h = window.innerHeight;
    canvas.width = w * dpr; canvas.height = h * dpr;
    canvas.style.width = w+'px'; canvas.style.height = h+'px';
    ctx.setTransform(dpr,0,0,dpr,0,0);
    COUNT = Math.max(18, Math.min(46, Math.round((w*h)/42000)));
    nodes = [];
    for(var i=0;i<COUNT;i++){
      nodes.push({
        x: Math.random()*w, y: Math.random()*h,
        vx: (Math.random()-0.5)*0.18, vy: (Math.random()-0.5)*0.18,
        r: 1 + Math.random()*1.4
      });
    }
  }
  resize();
  window.addEventListener('resize', resize);

  if(reduceMotion){
    // Draw a single static frame, no animation loop.
    drawFrame();
    return;
  }

  function drawFrame(){
    ctx.clearRect(0,0,w,h);
    var linkDist = Math.min(180, w*0.14);
    for(var i=0;i<nodes.length;i++){
      var n = nodes[i];
      for(var j=i+1;j<nodes.length;j++){
        var m = nodes[j];
        var dx = n.x-m.x, dy = n.y-m.y;
        var dist = Math.sqrt(dx*dx+dy*dy);
        if(dist < linkDist){
          var alpha = (1 - dist/linkDist) * 0.14;
          ctx.strokeStyle = 'rgba(63,224,208,'+alpha+')';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(n.x,n.y); ctx.lineTo(m.x,m.y);
          ctx.stroke();
        }
      }
    }
    for(var k=0;k<nodes.length;k++){
      var p = nodes[k];
      ctx.fillStyle = 'rgba(139,127,255,0.45)';
      ctx.beginPath();
      ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
      ctx.fill();
    }
  }

  function step(){
    for(var i=0;i<nodes.length;i++){
      var n = nodes[i];
      n.x += n.vx; n.y += n.vy;
      if(n.x < 0 || n.x > w) n.vx *= -1;
      if(n.y < 0 || n.y > h) n.vy *= -1;
    }
    drawFrame();
    requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

/* ============================================================
   CURSOR SPARKS — small trailing particles that fizz off the
   custom cursor ring as it moves, reinforcing the "live current"
   identity of the design
   ============================================================ */
function initCursorSparks(){
  if(isTouch) return;
  var canvas = document.getElementById('cursorSparkCanvas');
  if(!canvas) return;
  var ctx = canvas.getContext('2d');
  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if(reduceMotion) return;

  var w, h, dpr = Math.min(window.devicePixelRatio || 1, 2);
  function resize(){
    w = window.innerWidth; h = window.innerHeight;
    canvas.width = w*dpr; canvas.height = h*dpr;
    canvas.style.width = w+'px'; canvas.style.height = h+'px';
    ctx.setTransform(dpr,0,0,dpr,0,0);
  }
  resize();
  window.addEventListener('resize', resize);

  var sparks = [];
  var last = { x: -9999, y: -9999 };
  var colors = ['#3fe0d0','#8b7fff','#d89159'];

  window.addEventListener('mousemove', function(e){
    var dx = e.clientX - last.x, dy = e.clientY - last.y;
    var moved = Math.sqrt(dx*dx+dy*dy);
    last.x = e.clientX; last.y = e.clientY;
    if(moved < 4) return;
    if(sparks.length > 60) return;
    sparks.push({
      x: e.clientX, y: e.clientY,
      vx: (Math.random()-0.5)*0.6, vy: (Math.random()-0.5)*0.6,
      life: 1,
      r: 1 + Math.random()*1.6,
      c: colors[(Math.random()*colors.length)|0]
    });
  });

  function step(){
    ctx.clearRect(0,0,w,h);
    for(var i=sparks.length-1;i>=0;i--){
      var s = sparks[i];
      s.x += s.vx; s.y += s.vy;
      s.life -= 0.028;
      if(s.life <= 0){ sparks.splice(i,1); continue; }
      ctx.globalAlpha = Math.max(0, s.life);
      ctx.fillStyle = s.c;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r*s.life, 0, Math.PI*2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
    requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

/* ============================================================
   SECTION LABELS — matrix-style scramble/decrypt reveal
   The label text (e.g. "Who Am I") resolves out of random
   glyphs the first time its section-head scrolls into view.
   ============================================================ */
function initDecryptLabels(){
  if(reduceMotion) return;
  var glyphs = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ#$%&01';
  var els = document.querySelectorAll('.section-label');
  if(!els.length || !('IntersectionObserver' in window)) return;

  function scramble(el){
    var final = el.textContent;
    var len = final.length;
    var frame = 0;
    var maxFrames = 14;
    el.classList.add('decrypting');
    var timer = setInterval(function(){
      var out = '';
      for(var i=0;i<len;i++){
        var ch = final[i];
        if(ch === ' '){ out += ' '; continue; }
        var revealAt = (i/len) * maxFrames;
        if(frame >= revealAt + 3){ out += ch; }
        else { out += glyphs[(Math.random()*glyphs.length)|0]; }
      }
      el.textContent = out;
      frame++;
      if(frame > maxFrames){
        clearInterval(timer);
        el.textContent = final;
        el.classList.remove('decrypting');
      }
    }, 34);
  }

  var io = new IntersectionObserver(function(entries){
    entries.forEach(function(entry){
      if(entry.isIntersecting){
        scramble(entry.target);
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.6 });

  els.forEach(function(el){ io.observe(el); });
}

/* ============================================================
   HERO — cursor-reactive 3D parallax tilt on the whole
   hero-content stack (title/eyebrow/role-cycler), layered on
   top of the existing circuit-canvas mouse tracking
   ============================================================ */
function initHeroTilt(){
  if(isTouch || reduceMotion) return;
  var hero = document.getElementById('hero');
  var content = document.querySelector('.hero-content');
  if(!hero || !content) return;
  var tx = 0, ty = 0, ctx2 = 0, cty = 0;

  hero.addEventListener('mousemove', function(e){
    var rect = hero.getBoundingClientRect();
    var px = (e.clientX - rect.left) / rect.width;
    var py = (e.clientY - rect.top) / rect.height;
    tx = (px - 0.5) * 10;   // rotateY range
    ty = (0.5 - py) * 8;    // rotateX range
  });
  hero.addEventListener('mouseleave', function(){ tx = 0; ty = 0; });

  function raf(){
    ctx2 = lerp(ctx2, tx, 0.08);
    cty = lerp(cty, ty, 0.08);
    content.style.setProperty('--tiltX', ctx2.toFixed(2)+'deg');
    content.style.setProperty('--tiltY', cty.toFixed(2)+'deg');
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);
}

/* ============================================================
   CTA BUTTONS — chromatic ripple burst on click, echoing the
   "live current" identity of the glowing conic borders
   ============================================================ */
function initBtnBurst(){
  if(reduceMotion) return;
  var btns = document.querySelectorAll('.glow-btn, .ghost-btn');
  btns.forEach(function(btn){
    btn.addEventListener('click', function(e){
      var rect = btn.getBoundingClientRect();
      var burst = document.createElement('span');
      burst.className = 'btn-burst';
      burst.style.left = (e.clientX - rect.left) + 'px';
      burst.style.top = (e.clientY - rect.top) + 'px';
      btn.appendChild(burst);
      setTimeout(function(){ burst.remove(); }, 650);
    });
  });
}

/* ============================================================
   APP INIT
   ============================================================ */
document.addEventListener('DOMContentLoaded', function(){
  // Each visual effect is optional — if a CDN script (three.js/GSAP)
  // fails to load or a canvas effect throws, it must never block the
  // rest of the page (especially the hero name reveal below).
  function safe(fn){
    try{ fn(); }catch(err){ if(window.console) console.warn('[portfolio] skipped', fn.name, err); }
  }

  safe(initCursor);
  safe(initCircuit);
  safe(initHero3D);
  safe(initSpine);
  safe(initNavRail);
  safe(initMobileNav);
  safe(initTerminal);
  safe(initTimeline);
  safe(initReveal);
  safe(initPressureCanvas);
  safe(initSwarmCanvas);
  safe(initTiltCards);
  safe(initMagnetic);
  safe(initGalaxy);
  safe(initCounters);
  safe(initMountain);
  safe(initGlobe);
  safe(initProjectFilter);
  safe(initCertModal);
  safe(initBackToTop);
  safe(initImageFallbacks);
  safe(initBgSignal);
  safe(initCursorSparks);
  safe(initDecryptLabels);
  safe(initHeroTilt);
  safe(initBtnBurst);

  // Hard guarantee: whatever happens above, the loader must not sit
  // on screen forever and the hero name must always end up visible.
  var heroRevealed = false;
  function revealHeroNow(){
    if(heroRevealed) return;
    heroRevealed = true;
    var loader = document.getElementById('loader');
    if(loader) loader.classList.add('hidden');
    safe(playHeroIntro);
  }
  try{
    runLoader(revealHeroNow);
  }catch(err){
    revealHeroNow();
  }
  setTimeout(revealHeroNow, 4000); // failsafe if the loader logic itself errors
});
})();
