import { useState, useEffect, useRef, useCallback } from "react";

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;600;700;900&family=Barlow+Condensed:wght@300;400;600;700;800&family=JetBrains+Mono:wght@400;700&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
:root{
  --ink:#04040e;--ink2:#080818;--ink3:#0e0e22;--ink4:#141430;
  --border:rgba(88,60,255,0.22);--border2:rgba(88,60,255,0.1);
  --V:#583cff;--P:#ff2d78;--C:#00e4ff;--G:#1aff8c;
  --gold:#ffbe00;--silver:#a8b0c0;--bronze:#c87840;
  --text:#eae6ff;--muted:#5e587a;--dim:#2a2640;
  --r1:6px;--r2:12px;--r3:20px;
  --spring:cubic-bezier(0.34,1.56,0.64,1);--out:cubic-bezier(0.22,1,0.36,1);
}
html{scroll-behavior:smooth}
body{background:var(--ink);color:var(--text);font-family:'Barlow Condensed',sans-serif;font-size:17px;line-height:1.6;min-height:100vh;overflow-x:hidden;-webkit-font-smoothing:antialiased}
body::after{content:'';position:fixed;inset:0;pointer-events:none;z-index:9998;
  background:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E");opacity:.45}
body::before{content:'';position:fixed;inset:0;pointer-events:none;z-index:9997;
  background:repeating-linear-gradient(0deg,transparent,transparent 3px,rgba(0,0,0,.05) 3px,rgba(0,0,0,.05) 4px)}
h1,h2,h3,h4{font-family:'Orbitron',monospace;letter-spacing:.04em;line-height:1.1}
a{text-decoration:none;color:inherit}
button{cursor:pointer;border:none;outline:none;font-family:inherit}
input,select{font-family:inherit}
:focus-visible{outline:2px solid var(--V);outline-offset:3px;border-radius:4px}
::-webkit-scrollbar{width:4px}
::-webkit-scrollbar-track{background:var(--ink)}
::-webkit-scrollbar-thumb{background:var(--V);border-radius:2px}

/* NAVBAR */
.nb{position:fixed;top:0;left:0;right:0;z-index:1000;height:64px;display:flex;align-items:center;justify-content:space-between;padding:0 2rem;background:rgba(4,4,14,.88);backdrop-filter:blur(24px) saturate(1.5);border-bottom:1px solid var(--border);transition:box-shadow .3s}
.nb.sd{box-shadow:0 4px 40px rgba(0,0,0,.7)}
.nb-logo{display:flex;align-items:center;gap:.55rem;background:none}
.nb-logo-box{width:32px;height:32px;border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:.9rem;background:linear-gradient(135deg,var(--V),var(--P));box-shadow:0 0 18px rgba(88,60,255,.55)}
.nb-logo-txt{font-family:'Orbitron',monospace;font-size:.95rem;font-weight:900;letter-spacing:.14em;background:linear-gradient(90deg,var(--V),var(--P),var(--C));-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
.nb-links{display:flex;gap:.2rem;list-style:none}
.nb-link{font-family:'Barlow Condensed',sans-serif;font-weight:700;font-size:.78rem;letter-spacing:.15em;text-transform:uppercase;color:var(--muted);padding:.4rem .82rem;border-radius:var(--r1);transition:color .2s,background .2s;position:relative;background:none}
.nb-link:hover,.nb-link.on{color:var(--text);background:rgba(88,60,255,.12)}
.nb-link.on::after{content:'';position:absolute;bottom:4px;left:50%;transform:translateX(-50%);width:16px;height:2px;background:linear-gradient(90deg,var(--V),var(--P));border-radius:2px}
.nb-right{display:flex;align-items:center;gap:.65rem}
.nb-user{display:flex;align-items:center;gap:.55rem;background:rgba(88,60,255,.1);border:1px solid var(--border);border-radius:50px;padding:.28rem .85rem .28rem .42rem}
.nb-av{width:26px;height:26px;border-radius:50%;background:linear-gradient(135deg,var(--V),var(--P));display:flex;align-items:center;justify-content:center;font-size:.62rem;font-weight:900;color:#fff;font-family:'Orbitron',monospace}
.nb-uname{font-size:.72rem;font-weight:700;letter-spacing:.08em;color:var(--C)}
.nb-logout{background:none;color:var(--muted);font-size:.65rem;padding:.18rem .35rem;border-radius:3px;transition:color .2s}
.nb-logout:hover{color:var(--P)}
.nb-cta{background:linear-gradient(135deg,var(--V),var(--P));color:#fff;font-family:'Orbitron',monospace;font-size:.58rem;font-weight:700;letter-spacing:.14em;padding:.5rem 1.15rem;border-radius:var(--r1);transition:all .25s;box-shadow:0 0 18px rgba(88,60,255,.4)}
.nb-cta:hover{transform:translateY(-2px);box-shadow:0 6px 26px rgba(88,60,255,.65)}
.nb-ham{display:none;background:none;color:var(--text);font-size:1.25rem;padding:.28rem}
.nb-mob{display:none;position:fixed;top:64px;left:0;right:0;z-index:999;background:rgba(4,4,14,.97);backdrop-filter:blur(24px);border-bottom:1px solid var(--border);padding:1.25rem;flex-direction:column;gap:.4rem}
.nb-mob.open{display:flex}
.nb-mob-link{font-family:'Orbitron',monospace;font-size:.78rem;font-weight:700;letter-spacing:.1em;color:var(--muted);padding:.7rem 1rem;border-radius:var(--r1);background:none;text-align:left;transition:color .2s,background .2s}
.nb-mob-link:hover,.nb-mob-link.on{color:var(--text);background:rgba(88,60,255,.1)}

/* PAGE */
.page{padding-top:64px;min-height:100vh}

/* BUTTONS */
.btn{display:inline-flex;align-items:center;gap:.45rem;font-family:'Orbitron',monospace;font-weight:700;font-size:.62rem;letter-spacing:.14em;text-transform:uppercase;padding:.8rem 1.75rem;border-radius:var(--r1);transition:all .25s;position:relative;overflow:hidden}
.btn::after{content:'';position:absolute;inset:0;background:linear-gradient(135deg,rgba(255,255,255,.13),transparent);opacity:0;transition:opacity .2s}
.btn:hover::after{opacity:1}
.btn-p{background:linear-gradient(135deg,var(--V),var(--P));color:#fff;box-shadow:0 0 26px rgba(88,60,255,.45)}
.btn-p:hover{transform:translateY(-3px);box-shadow:0 10px 34px rgba(88,60,255,.7)}
.btn-g{background:transparent;color:var(--text);border:1px solid var(--border)}
.btn-g:hover{border-color:var(--V);color:var(--V);transform:translateY(-2px)}
.btn-c{background:rgba(0,228,255,.1);border:1px solid rgba(0,228,255,.3);color:var(--C)}
.btn-c:hover{background:var(--C);color:var(--ink);transform:translateY(-2px)}

/* HERO */
.hero{position:relative;overflow:hidden;min-height:calc(100vh - 64px);display:grid;place-items:center;padding:4rem 2rem 6rem;text-align:center}
.hero-bg{position:absolute;inset:0;z-index:0;background:var(--ink)}
.hero-bg::before{content:'';position:absolute;inset:0;background:radial-gradient(ellipse 100% 70% at 50% 0%,rgba(88,60,255,.22) 0%,transparent 65%),radial-gradient(ellipse 60% 50% at 88% 65%,rgba(255,45,120,.12) 0%,transparent 60%),radial-gradient(ellipse 50% 40% at 12% 80%,rgba(0,228,255,.08) 0%,transparent 55%)}
.hero-bg::after{content:'';position:absolute;inset:0;background-image:linear-gradient(rgba(88,60,255,.08) 1px,transparent 1px),linear-gradient(90deg,rgba(88,60,255,.08) 1px,transparent 1px);background-size:54px 54px;mask-image:radial-gradient(ellipse 75% 65% at 50% 50%,black 25%,transparent 100%)}
.orb{position:absolute;border-radius:50%;filter:blur(55px);pointer-events:none;z-index:0}
.o1{width:380px;height:380px;background:radial-gradient(circle,rgba(88,60,255,.28),transparent 70%);top:-80px;left:50%;transform:translateX(-50%);animation:ofl 8s ease-in-out infinite}
.o2{width:240px;height:240px;background:radial-gradient(circle,rgba(255,45,120,.2),transparent 70%);bottom:120px;right:6%;animation:ofl 10s ease-in-out infinite reverse}
.o3{width:180px;height:180px;background:radial-gradient(circle,rgba(0,228,255,.15),transparent 70%);top:180px;left:4%;animation:ofl 12s ease-in-out infinite 2s}
@keyframes ofl{0%,100%{transform:translateY(0)}33%{transform:translateY(-22px)}66%{transform:translateY(11px)}}
.hero-c{position:relative;z-index:1;max-width:840px}
.hero-kicker{display:inline-flex;align-items:center;gap:.55rem;font-family:'JetBrains Mono',monospace;font-size:.65rem;font-weight:700;letter-spacing:.25em;text-transform:uppercase;color:var(--C);background:rgba(0,228,255,.08);border:1px solid rgba(0,228,255,.24);border-radius:50px;padding:.35rem .92rem;margin-bottom:1.6rem;animation:fup .7s var(--out) both}
.hero-kicker::before{content:'◈';font-size:.52rem;animation:pd 2s ease-in-out infinite}
@keyframes pd{0%,100%{opacity:1}50%{opacity:.25}}
.hero-h1{font-size:clamp(2.2rem,6vw,4.4rem);font-weight:900;margin-bottom:1.4rem;animation:fup .75s .1s var(--out) both}
.hero-h1 .l1{background:linear-gradient(90deg,#fff 0%,#c4b8ff 100%);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;display:block}
.hero-h1 .l2{background:linear-gradient(90deg,var(--V),var(--P),var(--C));-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;display:block}
.hero-sub{font-size:clamp(.92rem,1.8vw,1.08rem);font-weight:400;color:var(--muted);max-width:540px;margin:0 auto 2.5rem;line-height:1.75;animation:fup .75s .2s var(--out) both}
.hero-btns{display:flex;gap:.85rem;justify-content:center;flex-wrap:wrap;animation:fup .75s .3s var(--out) both}
.hero-scroll{position:absolute;bottom:2rem;left:50%;transform:translateX(-50%);z-index:1;display:flex;flex-direction:column;align-items:center;gap:.35rem;color:var(--muted);font-size:.58rem;letter-spacing:.2em;text-transform:uppercase;animation:fup 1s .8s var(--out) both}
.scroll-ln{width:1px;height:34px;background:linear-gradient(var(--V),transparent);animation:sbn 2s ease-in-out infinite}
@keyframes sbn{0%,100%{transform:scaleY(1);transform-origin:top}50%{transform:scaleY(.35);transform-origin:top}}
@keyframes fup{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}

/* SECTION */
.sec{max-width:1120px;margin:0 auto;padding:5.5rem 2rem}
.sec-eye{display:inline-block;font-family:'JetBrains Mono',monospace;font-size:.6rem;letter-spacing:.25em;text-transform:uppercase;color:var(--V);margin-bottom:.65rem}
.sec-h{font-size:clamp(1.5rem,2.8vw,2.2rem);font-weight:900;margin-bottom:.55rem}
.sec-sub{color:var(--muted);font-size:.92rem;margin-bottom:2.75rem;max-width:480px}

/* STATS */
.stats{display:grid;grid-template-columns:repeat(4,1fr);gap:1px;background:var(--border2);border:1px solid var(--border2);border-radius:var(--r3);overflow:hidden;margin-bottom:2rem}
.stat-c{background:var(--ink2);padding:1.75rem 1.25rem;text-align:center;transition:background .2s}
.stat-c:hover{background:var(--ink3)}
.stat-n{font-family:'Orbitron',monospace;font-size:1.85rem;font-weight:900;display:block;margin-bottom:.25rem;background:linear-gradient(135deg,var(--V),var(--C));-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
.stat-l{font-size:.7rem;color:var(--muted);letter-spacing:.1em;text-transform:uppercase}

/* GAME CARDS */
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(285px,1fr));gap:1.15rem}
.gc{background:var(--ink2);border:1px solid var(--border2);border-radius:var(--r2);padding:1.65rem;position:relative;overflow:hidden;cursor:pointer;transition:transform .35s var(--spring),box-shadow .3s,border-color .3s}
.gc::before{content:'';position:absolute;top:0;left:0;right:0;height:2px;background:var(--cg,linear-gradient(90deg,var(--V),var(--P)));transform:scaleX(0);transform-origin:left;transition:transform .35s var(--out)}
.gc::after{content:'';position:absolute;inset:0;z-index:0;background:radial-gradient(ellipse 80% 60% at 50% 0%,rgba(88,60,255,.1),transparent 70%);opacity:0;transition:opacity .4s}
.gc:hover{transform:translateY(-7px) scale(1.01);border-color:rgba(88,60,255,.5);box-shadow:0 22px 65px rgba(0,0,0,.55)}
.gc:hover::before{transform:scaleX(1)}
.gc:hover::after{opacity:1}
.gc-in{position:relative;z-index:1}
.gc-head{display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:1.15rem}
.gc-icon{width:48px;height:48px;border-radius:var(--r1);display:flex;align-items:center;justify-content:center;font-size:1.45rem;background:linear-gradient(135deg,rgba(88,60,255,.15),rgba(88,60,255,.04));border:1px solid var(--border);transition:transform .3s var(--spring)}
.gc:hover .gc-icon{transform:scale(1.1) rotate(-4deg)}
.badge{font-family:'JetBrains Mono',monospace;font-size:.5rem;font-weight:700;letter-spacing:.1em;text-transform:uppercase;padding:.18rem .52rem;border-radius:50px}
.bc{background:rgba(0,228,255,.1);border:1px solid rgba(0,228,255,.28);color:var(--C)}
.ba{background:rgba(255,45,120,.1);border:1px solid rgba(255,45,120,.3);color:var(--P)}
.gc-title{font-size:.95rem;font-weight:700;margin-bottom:.42rem;letter-spacing:.04em}
.gc-desc{color:var(--muted);font-size:.82rem;line-height:1.55;margin-bottom:1.35rem}
.gc-foot{display:flex;align-items:center;justify-content:space-between}
.gc-play{background:rgba(88,60,255,.12);border:1px solid rgba(88,60,255,.3);color:var(--V);font-family:'Orbitron',monospace;font-size:.55rem;font-weight:700;letter-spacing:.15em;padding:.5rem 1.1rem;border-radius:var(--r1);transition:all .2s}
.gc-play:hover{background:var(--V);color:#fff}
.gc-diff{font-family:'JetBrains Mono',monospace;font-size:.56rem;color:var(--muted)}

/* ABOUT */
.ab-grid{display:grid;grid-template-columns:1fr 1fr;gap:3rem;align-items:center;margin-bottom:4rem}
.ab-txt h2{font-size:clamp(1.6rem,3vw,2.4rem);font-weight:900;margin-bottom:1rem}
.ab-txt p{color:var(--muted);font-size:.95rem;line-height:1.8;margin-bottom:.9rem}
.ab-vis{background:linear-gradient(135deg,var(--ink3),var(--ink2));border:1px solid var(--border);border-radius:var(--r3);padding:2.25rem;display:flex;flex-direction:column;gap:.9rem;position:relative;overflow:hidden}
.ab-vis::before{content:'GAME-O-HUB';position:absolute;font-family:'Orbitron',monospace;font-size:3.5rem;font-weight:900;opacity:.03;bottom:.25rem;right:.75rem;pointer-events:none;white-space:nowrap}
.afi{display:flex;align-items:flex-start;gap:.9rem;background:rgba(88,60,255,.06);border:1px solid var(--border2);border-radius:var(--r1);padding:.9rem;transition:border-color .2s}
.afi:hover{border-color:var(--border);background:rgba(88,60,255,.1)}
.afi-ico{width:36px;height:36px;border-radius:7px;flex-shrink:0;display:flex;align-items:center;justify-content:center;font-size:1.05rem;background:linear-gradient(135deg,rgba(88,60,255,.2),rgba(88,60,255,.04))}
.afi-t{font-family:'Orbitron',monospace;font-size:.65rem;font-weight:700;margin-bottom:.18rem}
.afi-d{color:var(--muted);font-size:.78rem}
.mission{background:linear-gradient(135deg,rgba(88,60,255,.12),rgba(255,45,120,.07));border:1px solid var(--border);border-radius:var(--r3);padding:2.75rem;text-align:center;position:relative;overflow:hidden}
.mission::before{content:'';position:absolute;inset:0;background:radial-gradient(ellipse 70% 60% at 50% 50%,rgba(88,60,255,.08),transparent)}
.mission-tag{font-family:'Orbitron',monospace;font-size:clamp(1.3rem,3vw,1.9rem);font-weight:900;margin-bottom:.9rem;position:relative;background:linear-gradient(90deg,var(--V),var(--P),var(--C));-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
.mission-txt{color:var(--muted);max-width:520px;margin:0 auto;font-size:.95rem;line-height:1.8;position:relative}

/* AUTH */
.auth-pg{min-height:calc(100vh - 64px);display:grid;place-items:center;padding:2rem;background:radial-gradient(ellipse 60% 60% at 50% 40%,rgba(88,60,255,.1) 0%,transparent 70%)}
.auth-card{background:var(--ink2);border:1px solid var(--border);border-radius:var(--r3);padding:2.55rem;width:100%;max-width:420px;box-shadow:0 40px 100px rgba(0,0,0,.65);animation:cent .5s var(--spring) both}
@keyframes cent{from{opacity:0;transform:scale(.92) translateY(18px)}}
.auth-brand{text-align:center;margin-bottom:1.85rem}
.auth-logo-box{display:inline-flex;align-items:center;justify-content:center;width:50px;height:50px;border-radius:13px;margin-bottom:.65rem;background:linear-gradient(135deg,var(--V),var(--P));box-shadow:0 0 26px rgba(88,60,255,.55);font-size:1.35rem}
.auth-name{font-family:'Orbitron',monospace;font-size:.9rem;font-weight:900;letter-spacing:.15em;background:linear-gradient(90deg,var(--V),var(--P));-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;display:block;margin-bottom:.2rem}
.auth-sub{color:var(--muted);font-size:.68rem;letter-spacing:.12em}
.auth-tabs{display:flex;background:var(--ink3);border-radius:var(--r1);padding:4px;margin-bottom:1.8rem}
.auth-tab{flex:1;background:transparent;color:var(--muted);font-family:'Orbitron',monospace;font-size:.56rem;font-weight:700;letter-spacing:.12em;text-transform:uppercase;padding:.56rem;border-radius:calc(var(--r1) - 2px);transition:all .2s;text-align:center}
.auth-tab.on{background:var(--V);color:#fff;box-shadow:0 4px 14px rgba(88,60,255,.45)}
.fg{margin-bottom:1rem}
.fl{display:block;font-size:.62rem;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:var(--muted);margin-bottom:.38rem}
.fi{width:100%;background:var(--ink3);border:1px solid var(--border2);border-radius:var(--r1);color:var(--text);font-size:.95rem;padding:.7rem .92rem;transition:border-color .2s,box-shadow .2s;outline:none;caret-color:var(--V)}
.fi::placeholder{color:var(--dim)}
.fi:focus{border-color:var(--V);box-shadow:0 0 0 3px rgba(88,60,255,.18)}
.fi.err{border-color:var(--P);box-shadow:0 0 0 3px rgba(255,45,120,.14)}
.fe{color:var(--P);font-size:.7rem;margin-top:.3rem}
.fsub{width:100%;padding:.88rem;background:linear-gradient(135deg,var(--V),var(--P));color:#fff;font-family:'Orbitron',monospace;font-size:.62rem;font-weight:700;letter-spacing:.14em;border-radius:var(--r1);transition:all .25s;box-shadow:0 4px 18px rgba(88,60,255,.4);margin-top:.45rem}
.fsub:hover:not(:disabled){transform:translateY(-2px);box-shadow:0 8px 28px rgba(88,60,255,.65)}
.fsub:disabled{opacity:.6}
.alrt{border-radius:var(--r1);padding:.75rem .95rem;font-size:.8rem;margin-bottom:.95rem;text-align:center;animation:fup .3s var(--out) both}
.alrt-ok{background:rgba(26,255,140,.08);border:1px solid rgba(26,255,140,.28);color:var(--G)}
.alrt-err{background:rgba(255,45,120,.08);border:1px solid rgba(255,45,120,.28);color:var(--P)}
.auth-sw{text-align:center;color:var(--muted);font-size:.78rem;margin-top:1.1rem}
.auth-sw button{background:none;color:var(--V);font-size:inherit;text-decoration:underline}
.spin{display:inline-block;width:12px;height:12px;border:2px solid rgba(255,255,255,.3);border-top-color:#fff;border-radius:50%;animation:sp .55s linear infinite;vertical-align:middle;margin-right:6px}
@keyframes sp{to{transform:rotate(360deg)}}

/* LEADERBOARD */
.lb-pg{max-width:1080px;margin:0 auto;padding:3rem 2rem 5rem}
.lb-ctrl{display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:.9rem;margin-bottom:1.85rem}
.lb-sel{background:var(--ink2);border:1px solid var(--border);border-radius:var(--r1);color:var(--text);font-size:.9rem;padding:.55rem .9rem;outline:none;min-width:210px;cursor:pointer;transition:border-color .2s}
.lb-sel:focus{border-color:var(--V)}
.lb-ref{display:flex;align-items:center;gap:.45rem;background:rgba(88,60,255,.1);border:1px solid var(--border);border-radius:var(--r1);color:var(--V);font-family:'Orbitron',monospace;font-size:.52rem;font-weight:700;letter-spacing:.12em;padding:.55rem .92rem;cursor:pointer;transition:all .2s}
.lb-ref:hover{background:rgba(88,60,255,.2)}
.lb-ref svg.sp2{animation:sp .7s linear infinite}
.lb-pb{display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:.9rem;background:linear-gradient(135deg,rgba(88,60,255,.1),rgba(0,228,255,.05));border:1px solid var(--border);border-radius:var(--r2);padding:1rem 1.4rem;margin-bottom:1.4rem}
.lb-pb-l{font-size:.6rem;letter-spacing:.15em;text-transform:uppercase;color:var(--muted);margin-bottom:.18rem;font-family:'JetBrains Mono',monospace}
.lb-pb-v{font-family:'Orbitron',monospace;font-size:1.3rem;font-weight:900;color:var(--V)}
.lb-wrap{overflow-x:auto;border-radius:var(--r2);border:1px solid var(--border2)}
.lb-t{width:100%;border-collapse:collapse;background:var(--ink2)}
.lb-t thead{background:var(--ink3)}
.lb-t th{font-family:'JetBrains Mono',monospace;font-size:.56rem;letter-spacing:.2em;text-transform:uppercase;color:var(--muted);padding:.92rem 1.15rem;text-align:left;border-bottom:1px solid var(--border2);white-space:nowrap}
.lb-t td{padding:.85rem 1.15rem;border-bottom:1px solid rgba(88,60,255,.05);font-size:.9rem}
.lb-t tr:last-child td{border-bottom:none}
.lb-t tbody tr{transition:background .15s}
.lb-t tbody tr:hover td{background:rgba(88,60,255,.05)}
.lb-t tbody tr.me td{background:rgba(88,60,255,.09)}
.lb-t tbody tr.me td:first-child{border-left:3px solid var(--V)}
.rb{display:inline-flex;align-items:center;justify-content:center;width:30px;height:30px;border-radius:50%;font-family:'Orbitron',monospace;font-size:.6rem;font-weight:900}
.r1c{background:rgba(255,190,0,.14);border:1px solid rgba(255,190,0,.42);color:var(--gold);box-shadow:0 0 12px rgba(255,190,0,.22)}
.r2c{background:rgba(168,176,192,.1);border:1px solid rgba(168,176,192,.32);color:var(--silver)}
.r3c{background:rgba(200,120,64,.1);border:1px solid rgba(200,120,64,.32);color:var(--bronze)}
.rnc{background:var(--ink3);border:1px solid var(--border2);color:var(--dim)}
.lb-pl{display:flex;align-items:center;gap:.55rem;font-weight:700}
.me-chip{font-size:.48rem;font-family:'JetBrains Mono',monospace;letter-spacing:.1em;background:rgba(88,60,255,.18);border:1px solid rgba(88,60,255,.38);color:var(--V);border-radius:50px;padding:.1rem .44rem}
.sp-pill{background:rgba(88,60,255,.1);border:1px solid rgba(88,60,255,.24);border-radius:50px;padding:.18rem .78rem;font-family:'Orbitron',monospace;font-size:.65rem;color:var(--V)}
.sp-pill.gd{background:rgba(255,190,0,.08);border-color:rgba(255,190,0,.28);color:var(--gold)}
.sp-pill.si{background:rgba(168,176,192,.08);border-color:rgba(168,176,192,.28);color:var(--silver)}
.sp-pill.br{background:rgba(200,120,64,.08);border-color:rgba(200,120,64,.28);color:var(--bronze)}
.g-tag{background:var(--ink3);border:1px solid var(--border2);border-radius:5px;padding:.16rem .5rem;font-size:.72rem;color:var(--muted)}
.lb-date{color:var(--dim);font-size:.72rem;font-family:'JetBrains Mono',monospace}
.sk-b{border-radius:5px;background:linear-gradient(90deg,var(--ink3),var(--dim),var(--ink3));background-size:200%;animation:sk-sh 1.8s infinite}
@keyframes sk-sh{0%{background-position:200% 0}100%{background-position:-200% 0}}
.lb-empty{text-align:center;padding:3.5rem 2rem;color:var(--muted)}
.lb-empty-i{font-size:2.5rem;margin-bottom:.7rem}
.lb-pag{display:flex;align-items:center;gap:.45rem;justify-content:center;margin-top:1.6rem}
.pg-b{background:var(--ink2);border:1px solid var(--border2);border-radius:var(--r1);color:var(--muted);font-family:'Orbitron',monospace;font-size:.52rem;font-weight:700;letter-spacing:.1em;padding:.5rem .78rem;cursor:pointer;transition:all .18s}
.pg-b:hover:not(:disabled){border-color:var(--V);color:var(--text)}
.pg-b.on{background:var(--V);border-color:var(--V);color:#fff}
.pg-b:disabled{opacity:.28}
.lb-upd{font-size:.65rem;color:var(--dim);font-family:'JetBrains Mono',monospace;align-self:center}

/* ═══════════════════════════════════════════
   TIC TAC TOE  (FIXED)
═══════════════════════════════════════════ */
.ttt-pg{min-height:100vh;background:var(--ink);display:flex;flex-direction:column;align-items:center;justify-content:center;padding:2rem;position:relative;overflow:hidden}
.ttt-pg::before{content:'';position:absolute;inset:0;background:radial-gradient(ellipse 65% 60% at 50% 30%,rgba(88,60,255,.15) 0%,transparent 70%),radial-gradient(ellipse 45% 40% at 80% 70%,rgba(255,45,120,.1) 0%,transparent 60%)}
.ttt-title{font-family:'Orbitron',monospace;font-size:1.45rem;font-weight:900;letter-spacing:.1em;background:linear-gradient(90deg,var(--V),var(--P));-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;margin-bottom:.2rem;text-align:center;position:relative;z-index:1}
.ttt-sub{color:var(--muted);font-size:.75rem;letter-spacing:.1em;text-align:center;margin-bottom:1.25rem;position:relative;z-index:1}
.ttt-mode{display:flex;background:var(--ink2);border:1px solid var(--border2);border-radius:var(--r1);padding:3px;margin-bottom:1.15rem;position:relative;z-index:1}
.mode-b{font-family:'Orbitron',monospace;font-size:.56rem;font-weight:700;letter-spacing:.1em;padding:.46rem .9rem;border-radius:calc(var(--r1) - 1px);border:none;cursor:pointer;background:transparent;color:var(--muted);transition:all .2s}
.mode-b.on{background:var(--V);color:#fff}
.ttt-sc{display:flex;gap:.85rem;margin-bottom:1.35rem;position:relative;z-index:1}
.sc-tile{background:var(--ink2);border:1px solid var(--border2);border-radius:var(--r1);padding:.65rem 1.2rem;text-align:center;min-width:72px;transition:border-color .2s,box-shadow .2s}
.sc-tile.hi{border-color:var(--V);box-shadow:0 0 16px rgba(88,60,255,.28)}
.sc-lbl{font-size:.56rem;font-family:'Orbitron',monospace;letter-spacing:.14em;color:var(--muted);margin-bottom:.14rem}
.sc-val{font-family:'Orbitron',monospace;font-size:1.25rem;font-weight:900}
.sc-x .sc-val{color:var(--C)}.sc-o .sc-val{color:var(--P)}.sc-d .sc-val{color:var(--gold)}
.ttt-status{font-family:'Orbitron',monospace;font-size:.72rem;letter-spacing:.1em;color:var(--muted);margin-bottom:1.1rem;min-height:1.1em;text-align:center;position:relative;z-index:1;transition:color .3s}
.ttt-status.win{color:var(--V)}.ttt-status.draw{color:var(--gold)}.ttt-status.lose{color:var(--P)}
.ttt-board{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-bottom:1.25rem;position:relative;z-index:1}
.cell{width:102px;height:102px;background:var(--ink2);border:1px solid rgba(88,60,255,.18);border-radius:var(--r2);display:flex;align-items:center;justify-content:center;font-family:'Orbitron',monospace;font-size:2.5rem;font-weight:900;transition:all .15s;user-select:none;position:relative;overflow:hidden}
.cell.clickable{cursor:pointer}
.cell.clickable:hover{background:rgba(88,60,255,.12);border-color:rgba(88,60,255,.5);transform:scale(1.04)}
.cell.X{color:var(--C);text-shadow:0 0 16px rgba(0,228,255,.55)}
.cell.O{color:var(--P);text-shadow:0 0 16px rgba(255,45,120,.55)}
.cell.win-c{background:rgba(88,60,255,.18);border-color:var(--V);box-shadow:0 0 20px rgba(88,60,255,.4);animation:pw .8s ease infinite alternate}
@keyframes pw{from{box-shadow:0 0 10px rgba(88,60,255,.4)}to{box-shadow:0 0 34px rgba(88,60,255,.8)}}
.cell.pop{animation:pop .22s var(--spring) both}
@keyframes pop{from{transform:scale(.3);opacity:0}to{transform:scale(1);opacity:1}}
.ttt-acts{display:flex;gap:.65rem;flex-wrap:wrap;justify-content:center;position:relative;z-index:1}
.ttt-btn{font-family:'Orbitron',monospace;font-size:.58rem;font-weight:700;letter-spacing:.12em;padding:.62rem 1.35rem;border-radius:var(--r1);transition:all .2s}
.ttt-bp{background:linear-gradient(135deg,var(--V),var(--P));color:#fff;box-shadow:0 4px 16px rgba(88,60,255,.4)}
.ttt-bp:hover{transform:translateY(-2px);box-shadow:0 8px 26px rgba(88,60,255,.6)}
.ttt-bo{background:transparent;color:var(--muted);border:1px solid var(--border2)}
.ttt-bo:hover{color:var(--text);border-color:rgba(88,60,255,.5)}
.pts-earned{font-family:'Orbitron',monospace;font-size:.68rem;color:var(--gold);text-align:center;min-height:1.1em;margin-bottom:.75rem;position:relative;z-index:1}

/* ═══════════════════════════════════════════
   TYPING GAME
═══════════════════════════════════════════ */
.typ-pg{min-height:100vh;background:var(--ink);display:flex;flex-direction:column;align-items:center;justify-content:center;padding:2rem;position:relative}
.typ-pg::before{content:'';position:absolute;inset:0;background:radial-gradient(ellipse 65% 55% at 50% 30%,rgba(88,60,255,.13) 0%,transparent 70%)}
.typ-title{font-family:'Orbitron',monospace;font-size:1.45rem;font-weight:900;letter-spacing:.1em;background:linear-gradient(90deg,var(--V),var(--C));-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;margin-bottom:.2rem;text-align:center;position:relative}
.typ-sub{color:var(--muted);font-size:.75rem;letter-spacing:.1em;text-align:center;margin-bottom:1.65rem;position:relative}
.typ-stats{display:flex;gap:.85rem;margin-bottom:1.35rem;flex-wrap:wrap;justify-content:center;position:relative}
.typ-stat{background:var(--ink2);border:1px solid var(--border2);border-radius:var(--r1);padding:.65rem 1.15rem;text-align:center;min-width:72px}
.ts-l{font-size:.56rem;font-family:'Orbitron',monospace;letter-spacing:.14em;color:var(--muted);margin-bottom:.12rem}
.ts-v{font-family:'Orbitron',monospace;font-size:1.2rem;font-weight:900}
.ts-v.tm{color:var(--P)}.ts-v.wpm{color:var(--C)}.ts-v.acc{color:var(--V)}
.typ-words{background:var(--ink2);border:1px solid var(--border2);border-radius:var(--r2);padding:1.35rem 1.75rem;max-width:660px;width:100%;margin-bottom:1.1rem;min-height:100px;display:flex;flex-wrap:wrap;gap:.42rem;align-content:flex-start;overflow:hidden;position:relative}
.wt{font-family:'JetBrains Mono',monospace;font-size:1rem;padding:.1rem .05rem;border-radius:3px;letter-spacing:.04em;transition:color .1s}
.wt.pend{color:#2a2640}.wt.ok{color:var(--V)}.wt.bad{color:var(--P);text-decoration:line-through}.wt.cur{color:var(--text);border-bottom:2px solid var(--V)}
.typ-inp{width:100%;max-width:660px;background:var(--ink2);border:2px solid rgba(88,60,255,.28);border-radius:var(--r1);color:var(--text);font-family:'JetBrains Mono',monospace;font-size:1rem;padding:.8rem 1.15rem;outline:none;transition:border-color .2s;caret-color:var(--V)}
.typ-inp:focus{border-color:var(--V);box-shadow:0 0 0 3px rgba(88,60,255,.18)}
.typ-inp:disabled{opacity:.5}
.typ-acts{display:flex;gap:.65rem;margin-top:1.1rem;flex-wrap:wrap;justify-content:center;position:relative}
.typ-btn{font-family:'Orbitron',monospace;font-size:.58rem;font-weight:700;letter-spacing:.12em;padding:.62rem 1.35rem;border-radius:var(--r1);transition:all .2s}
.tb-p{background:linear-gradient(135deg,var(--V),var(--C));color:#fff}
.tb-p:hover{transform:translateY(-2px);box-shadow:0 8px 22px rgba(88,60,255,.5)}
.tb-o{background:transparent;color:var(--muted);border:1px solid var(--border2)}
.tb-o:hover{color:var(--text);border-color:rgba(88,60,255,.5)}
.res-ov{position:fixed;inset:0;background:rgba(4,4,14,.93);display:flex;align-items:center;justify-content:center;z-index:999;animation:fup .3s var(--out) both}
.res-card{background:var(--ink2);border:1px solid var(--border);border-radius:var(--r3);padding:2.3rem;text-align:center;max-width:350px;width:90%}
.res-title{font-family:'Orbitron',monospace;font-size:1.05rem;margin-bottom:1.35rem}
.res-grid{display:grid;grid-template-columns:1fr 1fr;gap:.65rem;margin-bottom:1.35rem}
.res-big{font-family:'Orbitron',monospace;font-size:2.3rem;font-weight:900;color:var(--V);margin:.4rem 0 .18rem}
.res-pts{color:var(--muted);font-size:.75rem;letter-spacing:.1em}

/* ═══════════════════════════════════════════
   SWIPE THE PLATE
═══════════════════════════════════════════ */
.swipe-pg{min-height:100vh;background:var(--ink);display:flex;flex-direction:column;align-items:center;justify-content:center;padding:2rem;position:relative;overflow:hidden}
.swipe-pg::before{content:'';position:absolute;inset:0;background:radial-gradient(ellipse 65% 60% at 50% 30%,rgba(255,45,120,.12) 0%,transparent 70%)}
.swipe-arena{position:relative;width:420px;height:520px;background:var(--ink2);border:1px solid var(--border);border-radius:var(--r3);overflow:hidden;cursor:none}
@media(max-width:480px){.swipe-arena{width:320px;height:420px}}
.plate{position:absolute;width:60px;height:60px;border-radius:50%;background:linear-gradient(135deg,rgba(255,45,120,.2),rgba(255,45,120,.05));border:2px solid rgba(255,45,120,.5);display:flex;align-items:center;justify-content:center;font-size:1.6rem;cursor:pointer;transition:transform .1s;user-select:none}
.plate:hover{transform:scale(1.12);border-color:var(--P);box-shadow:0 0 22px rgba(255,45,120,.5)}
.plate.caught{animation:plate-catch .3s ease forwards}
@keyframes plate-catch{0%{transform:scale(1.2);opacity:1}100%{transform:scale(2);opacity:0}}
.swipe-cursor{position:absolute;width:28px;height:28px;border-radius:50%;background:rgba(255,45,120,.3);border:2px solid var(--P);pointer-events:none;transform:translate(-50%,-50%);z-index:10;transition:transform .05s}
.swipe-hud{display:flex;gap:1.2rem;margin-bottom:1rem;position:relative;z-index:1}
.swipe-stat{text-align:center}
.sw-l{font-family:'JetBrains Mono',monospace;font-size:.58rem;letter-spacing:.15em;text-transform:uppercase;color:var(--muted);margin-bottom:.1rem}
.sw-v{font-family:'Orbitron',monospace;font-size:1.3rem;font-weight:900;color:var(--P)}
.sw-vg{color:var(--G)}
.miss-flash{position:absolute;inset:0;background:rgba(255,45,120,.15);pointer-events:none;opacity:0;border-radius:var(--r3)}
.miss-flash.show{animation:mf .4s ease}
@keyframes mf{0%{opacity:1}100%{opacity:0}}

/* ═══════════════════════════════════════════
   MENJA (SLASH GAME)
═══════════════════════════════════════════ */
.menja-pg{min-height:100vh;background:var(--ink);display:flex;flex-direction:column;align-items:center;justify-content:center;padding:2rem;position:relative;overflow:hidden;cursor:crosshair}
.menja-pg::before{content:'';position:absolute;inset:0;background:radial-gradient(ellipse 65% 60% at 50% 30%,rgba(88,60,255,.12) 0%,transparent 70%),radial-gradient(ellipse 45% 40% at 80% 70%,rgba(255,45,120,.1) 0%,transparent 60%)}
.menja-canvas-wrap{position:relative;width:480px;height:520px;background:rgba(8,8,24,.8);border:1px solid var(--border);border-radius:var(--r3);overflow:hidden;cursor:crosshair}
@media(max-width:520px){.menja-canvas-wrap{width:320px;height:420px}}
.menja-obj{position:absolute;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:1.5rem;user-select:none;pointer-events:none;transition:none}
.menja-slash{position:absolute;pointer-events:none;height:3px;background:linear-gradient(90deg,transparent,rgba(255,45,120,.8),transparent);border-radius:2px;transform-origin:left center;animation:slash-fade .4s ease forwards}
@keyframes slash-fade{0%{opacity:1;transform:scaleX(1)}100%{opacity:0;transform:scaleX(.3)}}
.menja-explosion{position:absolute;pointer-events:none;width:50px;height:50px;border-radius:50%;background:radial-gradient(circle,rgba(255,200,0,.8),rgba(255,45,120,.4),transparent 70%);transform:translate(-50%,-50%);animation:explode .4s ease forwards}
@keyframes explode{0%{transform:translate(-50%,-50%) scale(0);opacity:1}100%{transform:translate(-50%,-50%) scale(3);opacity:0}}
.menja-hud{display:flex;gap:1.2rem;margin-bottom:1rem;position:relative;z-index:1}
.menja-lives{display:flex;gap:.3rem;font-size:1.1rem}
.menja-trail{position:absolute;border-radius:50%;pointer-events:none;background:rgba(255,45,120,.6);animation:trail-fade .3s ease forwards}
@keyframes trail-fade{0%{opacity:.8;transform:scale(1)}100%{opacity:0;transform:scale(.2)}}

/* ═══════════════════════════════════════════
   PUZZLE GAME
═══════════════════════════════════════════ */
.puzzle-pg{min-height:100vh;background:var(--ink);display:flex;flex-direction:column;align-items:center;justify-content:center;padding:2rem;position:relative}
.puzzle-pg::before{content:'';position:absolute;inset:0;background:radial-gradient(ellipse 65% 60% at 50% 30%,rgba(0,228,255,.1) 0%,transparent 70%)}
.puzzle-board{display:grid;gap:4px;position:relative;z-index:1;background:var(--ink2);border:1px solid var(--border);border-radius:var(--r2);padding:12px}
.puzzle-tile{border-radius:8px;cursor:pointer;display:flex;align-items:center;justify-content:center;font-family:'Orbitron',monospace;font-weight:900;transition:all .15s;user-select:none;border:2px solid transparent}
.puzzle-tile:hover:not(.empty):not(.solved-t){border-color:rgba(0,228,255,.5);transform:scale(1.04);box-shadow:0 0 16px rgba(0,228,255,.3)}
.puzzle-tile.empty{background:rgba(0,228,255,.05);border:2px dashed rgba(0,228,255,.15);cursor:default}
.puzzle-tile.solved-t{border-color:rgba(26,255,140,.4);box-shadow:0 0 12px rgba(26,255,140,.2)}
.puzzle-tile.slide{animation:tile-slide .15s ease}
@keyframes tile-slide{0%{transform:scale(.9)}100%{transform:scale(1)}}
.puzzle-complete{position:fixed;inset:0;background:rgba(4,4,14,.92);display:flex;align-items:center;justify-content:center;z-index:999;animation:fup .3s var(--out) both}
.puzzle-win-card{background:var(--ink2);border:1px solid var(--border);border-radius:var(--r3);padding:2.4rem;text-align:center;max-width:340px;width:90%}

/* GAME BACK BTN */
.game-back{position:relative;z-index:1;background:transparent;color:var(--muted);border:1px solid var(--border2);font-family:'Orbitron',monospace;font-size:.56rem;font-weight:700;letter-spacing:.12em;padding:.55rem 1.1rem;border-radius:var(--r1);transition:all .2s;margin-top:.85rem}
.game-back:hover{color:var(--text);border-color:rgba(88,60,255,.5)}
.game-title-main{font-family:'Orbitron',monospace;font-size:1.4rem;font-weight:900;letter-spacing:.1em;text-align:center;margin-bottom:.2rem;position:relative;z-index:1}
.game-sub-main{color:var(--muted);font-size:.72rem;letter-spacing:.1em;text-align:center;margin-bottom:1.2rem;position:relative;z-index:1}
.hud-row{display:flex;gap:.85rem;margin-bottom:.95rem;flex-wrap:wrap;justify-content:center;position:relative;z-index:1}
.hud-box{background:var(--ink2);border:1px solid var(--border2);border-radius:var(--r1);padding:.6rem 1.1rem;text-align:center;min-width:68px}
.hud-l{font-size:.54rem;font-family:'Orbitron',monospace;letter-spacing:.14em;color:var(--muted);margin-bottom:.1rem}
.hud-v{font-family:'Orbitron',monospace;font-size:1.15rem;font-weight:900}
.game-start-btn{background:linear-gradient(135deg,var(--V),var(--P));color:#fff;font-family:'Orbitron',monospace;font-size:.62rem;font-weight:700;letter-spacing:.14em;padding:.75rem 1.8rem;border-radius:var(--r1);transition:all .25s;box-shadow:0 4px 18px rgba(88,60,255,.4);position:relative;z-index:1}
.game-start-btn:hover{transform:translateY(-2px);box-shadow:0 8px 28px rgba(88,60,255,.65)}

/* FOOTER */
.ft{border-top:1px solid var(--border2);padding:2.25rem 2rem;display:grid;grid-template-columns:1fr auto 1fr;align-items:center;gap:1rem;max-width:1120px;margin:0 auto}
.ft-logo{font-family:'Orbitron',monospace;font-size:.82rem;font-weight:900;letter-spacing:.14em;background:linear-gradient(90deg,var(--V),var(--P));-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
.ft-copy{color:var(--muted);font-size:.72rem;text-align:center}
.ft-links{display:flex;gap:.9rem;justify-content:flex-end}
.ft-lk{background:none;color:var(--muted);font-size:.72rem;transition:color .2s}
.ft-lk:hover{color:var(--V)}

/* RESPONSIVE */
@media(max-width:900px){.ab-grid{grid-template-columns:1fr}.ft{grid-template-columns:1fr;text-align:center}.ft-links{justify-content:center}.stats{grid-template-columns:1fr 1fr}}
@media(max-width:660px){.nb{padding:0 1.1rem}.nb-links{display:none}.nb-ham{display:block}.hero-h1{font-size:2rem}.hero-btns{flex-direction:column;align-items:center}.hero-btns .btn{width:100%;justify-content:center}.grid{grid-template-columns:1fr}.sec{padding:3.5rem 1.25rem}.auth-card{padding:1.6rem 1.35rem}.lb-pg{padding:1.75rem 1.1rem 4rem}.cell{width:86px;height:86px;font-size:2rem}}
`;

// ═══════════════════════════════════════════════════════════════════
//  DATA
// ═══════════════════════════════════════════════════════════════════
const GAMES = [
  {id:"tictactoe",icon:"⭕",title:"Tic Tac Toe",   desc:"Classic 3×3 — beat the minimax AI or challenge a friend locally.",badge:"classic",grad:"linear-gradient(90deg,#583cff,#00e4ff)",diff:"Easy"},
  {id:"typing",   icon:"⌨️",title:"Typing Game",    desc:"60 seconds, unlimited words. Race to the highest WPM score.",   badge:"classic",grad:"linear-gradient(90deg,#00e4ff,#583cff)",diff:"Medium"},
  {id:"swipe",    icon:"🍽️",title:"Swipe the Plate",desc:"Click plates before they fall — test your reflexes to the limit.", badge:"classic",grad:"linear-gradient(90deg,#583cff,#ff2d78)",diff:"Medium"},
  {id:"menja",    icon:"⚔️",title:"Menja",          desc:"Slash cascading objects with your mouse in this frenetic game.",   badge:"classic",grad:"linear-gradient(90deg,#ff2d78,#583cff)",diff:"Hard"},
  {id:"puzzle",   icon:"🧩",title:"Puzzle",         desc:"Slide numbered tiles into order — how fast can you solve it?",    badge:"classic",grad:"linear-gradient(90deg,#00e4ff,#ff2d78)",diff:"Medium"},
  {id:"emotion",  icon:"😄",title:"Emotion Recognition",desc:"AI reads your facial expressions. Your face is the controller.",badge:"ai",grad:"linear-gradient(90deg,#ff2d78,#00e4ff)",diff:"Wild"},
  {id:"voice",    icon:"🎙️",title:"Voice Command",  desc:"Speak to navigate a labyrinth. No keyboard needed.",           badge:"ai",grad:"linear-gradient(90deg,#00e4ff,#ff2d78)",diff:"Wild"},
];

const GL={all:"All Games",tictactoe:"Tic Tac Toe",typing:"Typing Game",swipe:"Swipe the Plate",menja:"Menja",puzzle:"Puzzle",emotion:"Emotion Recognition",voice:"Voice Command"};

const MOCK_LB={
  all:[
    {id:1,rank:1,username:"CyberGhost_X",game_name:"typing",   score:9840,timestamp:"2025-07-14T11:05:00"},
    {id:2,rank:2,username:"NeonBlade99", game_name:"menja",    score:8200,timestamp:"2025-07-13T09:12:00"},
    {id:3,rank:3,username:"ZeroPing",   game_name:"tictactoe",score:7550,timestamp:"2025-07-12T18:44:00"},
    {id:4,rank:4,username:"PixelHunter",game_name:"puzzle",   score:6300,timestamp:"2025-07-11T14:22:00"},
    {id:5,rank:5,username:"SwipeStar",  game_name:"swipe",    score:4800,timestamp:"2025-07-08T11:55:00"},
    {id:6,rank:6,username:"KeyMstr_Z",  game_name:"typing",   score:4200,timestamp:"2025-07-07T08:14:00"},
  ],
  typing:[
    {id:1,rank:1,username:"CyberGhost_X",game_name:"typing",score:9840,timestamp:"2025-07-14T11:05:00"},
    {id:6,rank:2,username:"KeyMstr_Z",  game_name:"typing",score:4200,timestamp:"2025-07-07T08:14:00"},
  ],
  tictactoe:[{id:3,rank:1,username:"ZeroPing",game_name:"tictactoe",score:7550,timestamp:"2025-07-12T18:44:00"}],
  menja:[{id:2,rank:1,username:"NeonBlade99",game_name:"menja",score:8200,timestamp:"2025-07-13T09:12:00"}],
  swipe:[{id:5,rank:1,username:"SwipeStar",game_name:"swipe",score:4800,timestamp:"2025-07-08T11:55:00"}],
  puzzle:[{id:4,rank:1,username:"PixelHunter",game_name:"puzzle",score:6300,timestamp:"2025-07-11T14:22:00"}],
};

const FILTERS=[
  {v:"all",l:"🌐  All Games"},{v:"typing",l:"⌨️   Typing Game"},{v:"tictactoe",l:"⭕  Tic Tac Toe"},
  {v:"swipe",l:"🍽️  Swipe the Plate"},{v:"menja",l:"⚔️  Menja"},{v:"puzzle",l:"🧩  Puzzle"},
  {v:"emotion",l:"😄  Emotion Recognition"},{v:"voice",l:"🎙️  Voice Command"},
];

// ═══════════════════════════════════════════════════════════════════
//  AUTH
// ═══════════════════════════════════════════════════════════════════
function useAuth(){
  const [user,setUser]=useState(null);
  const [loading,setLoad]=useState(false);
  const login=useCallback(async(u,p)=>{
    setLoad(true);await new Promise(r=>setTimeout(r,750));setLoad(false);
    if(!u.trim()||p.length<6)return{success:false,error:"Invalid credentials."};
    setUser({id:1,username:u.trim(),email:`${u.trim()}@hub.gg`});return{success:true};
  },[]);
  const signup=useCallback(async(u,e,p)=>{
    setLoad(true);await new Promise(r=>setTimeout(r,900));setLoad(false);
    if(!u.trim()||!e.includes("@")||p.length<6)return{success:false,error:"Please check your inputs."};
    setUser({id:1,username:u.trim(),email:e});return{success:true};
  },[]);
  const logout=useCallback(()=>setUser(null),[]);
  const submitScore=useCallback(async(game,score)=>{console.log(`[SCORE] ${game}: ${score} by ${user?.username}`);},[user]);
  return{user,loading,login,signup,logout,submitScore};
}

// ═══════════════════════════════════════════════════════════════════
//  MINIMAX AI — FIXED
// ═══════════════════════════════════════════════════════════════════
const WIN_LINES=[[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];

function checkWinner(b){
  for(const [a,c,d] of WIN_LINES){
    if(b[a]&&b[a]===b[c]&&b[a]===b[d])return{winner:b[a],line:[a,c,d]};
  }
  if(b.every(Boolean))return{winner:"draw",line:[]};
  return null;
}

function minimax(b,isMax,depth){
  const r=checkWinner(b);
  if(r){
    if(r.winner==="O")return 10-depth;
    if(r.winner==="X")return depth-10;
    return 0;
  }
  if(isMax){
    let best=-Infinity;
    for(let i=0;i<9;i++){
      if(!b[i]){
        b[i]="O";
        best=Math.max(best,minimax(b,false,depth+1));
        b[i]=null;
      }
    }
    return best;
  }else{
    let best=Infinity;
    for(let i=0;i<9;i++){
      if(!b[i]){
        b[i]="X";
        best=Math.min(best,minimax(b,true,depth+1));
        b[i]=null;
      }
    }
    return best;
  }
}

function getBestMove(board){
  let bestScore=-Infinity,bestMove=-1;
  for(let i=0;i<9;i++){
    if(!board[i]){
      board[i]="O";
      const score=minimax(board,false,0);
      board[i]=null;
      if(score>bestScore){bestScore=score;bestMove=i;}
    }
  }
  return bestMove;
}

// ═══════════════════════════════════════════════════════════════════
//  WORD BANK
// ═══════════════════════════════════════════════════════════════════
const WORDS=["galaxy","pixel","quantum","nebula","cypher","vector","matrix","fusion","photon","binary","neural","cipher","zenith","cosmic","blazer","neon","orbit","shield","turbo","spark","drone","glitch","prism","synth","vortex","nova","surge","relay","flux","byte","laser","echo","phase","storm","blaze","sonic","rapid","swift","grid","node","core","pulse","link","wave","dash","zeal","apex","blitz","forge","chrome","volt","nexus","warp","shadow","quasar","helix","delta","rift","crisp","frost","blade","clutch","burst","forge","pivot","snap","zap","glow","hex","shift","drift","haze","flare","arc","zen","trek","bold","grit","hype"];
const genWords=(n=100)=>{const s=[...WORDS].sort(()=>Math.random()-.5);const r=[];while(r.length<n)r.push(...[...WORDS].sort(()=>Math.random()-.5));return r.slice(0,n);};

// ═══════════════════════════════════════════════════════════════════
//  NAVBAR
// ═══════════════════════════════════════════════════════════════════
function Navbar({page,setPage,user,logout}){
  const [sd,setSd]=useState(false);
  const [mob,setMob]=useState(false);
  useEffect(()=>{const h=()=>setSd(window.scrollY>10);window.addEventListener("scroll",h,{passive:true});return()=>window.removeEventListener("scroll",h);},[]);
  const go=p=>{setPage(p);setMob(false);};
  const links=[{id:"home",l:"Home"},{id:"about",l:"About"},{id:"leaderboard",l:"Leaderboard"}];
  return(<>
    <nav className={`nb ${sd?"sd":""}`}>
      <button className="nb-logo" onClick={()=>go("home")}>
        <div className="nb-logo-box">🎮</div>
        <span className="nb-logo-txt">GAME-O-HUB</span>
      </button>
      <ul className="nb-links" role="list">
        {links.map(l=><li key={l.id}><button className={`nb-link ${page===l.id?"on":""}`} onClick={()=>go(l.id)}>{l.l}</button></li>)}
      </ul>
      <div className="nb-right">
        {user?(<div className="nb-user">
          <div className="nb-av">{user.username[0].toUpperCase()}</div>
          <span className="nb-uname">{user.username}</span>
          <button className="nb-logout" onClick={logout}>✕</button>
        </div>):(
          <button className="nb-cta" onClick={()=>go("auth")}>Login</button>
        )}
        <button className="nb-ham" onClick={()=>setMob(o=>!o)}>{mob?"✕":"☰"}</button>
      </div>
    </nav>
    <div className={`nb-mob ${mob?"open":""}`}>
      {links.map(l=><button key={l.id} className={`nb-mob-link ${page===l.id?"on":""}`} onClick={()=>go(l.id)}>{l.l}</button>)}
      {!user&&<button className="btn btn-p" style={{marginTop:".5rem"}} onClick={()=>go("auth")}>Login / Sign Up</button>}
    </div>
  </>);
}

// ═══════════════════════════════════════════════════════════════════
//  HOME
// ═══════════════════════════════════════════════════════════════════
function Home({setPage,setGame}){
  const ref=useRef(null);
  return(<main className="page">
    <section className="hero">
      <div className="hero-bg"/><div className="orb o1"/><div className="orb o2"/><div className="orb o3"/>
      <div className="hero-c">
        <div className="hero-kicker">Play. Compete. Win.</div>
        <h1 className="hero-h1">
          <span className="l1">Welcome to GAME‑O‑HUB</span>
          <span className="l2">Classic Fun Meets AI</span>
        </h1>
        <p className="hero-sub">Challenge yourself with Tic Tac Toe, Typing, Swipe the Plate, Menja, and Puzzle — all playable in your browser, no install required.</p>
        <div className="hero-btns">
          <button className="btn btn-p" onClick={()=>ref.current?.scrollIntoView({behavior:"smooth"})}>▶ &nbsp;Play Now</button>
          <button className="btn btn-g" onClick={()=>setPage("leaderboard")}>🏆 &nbsp;Leaderboard</button>
          <button className="btn btn-c" onClick={()=>setPage("auth")}>🔐 &nbsp;Sign Up Free</button>
        </div>
      </div>
      <div className="hero-scroll"><span>Scroll</span><div className="scroll-ln"/></div>
    </section>
    <div style={{maxWidth:1120,margin:"0 auto",padding:"0 2rem"}}>
      <div className="stats">
        {[["5","Browser Games"],["2","AI Games"],["∞","Replays"],["🌍","Leaderboard"]].map(([n,l])=>(
          <div key={l} className="stat-c"><span className="stat-n">{n}</span><span className="stat-l">{l}</span></div>
        ))}
      </div>
    </div>
    <section className="sec" ref={ref}>
      <span className="sec-eye">// Game Library</span>
      <h2 className="sec-h">Choose Your Arena</h2>
      <p className="sec-sub">Five browser games + two AI-powered modes, all on one platform.</p>
      <div className="grid">
        {GAMES.map(g=>(
          <article key={g.id} className="gc" style={{"--cg":g.grad}} tabIndex={0}
            onClick={()=>setGame(g.id)} onKeyDown={e=>e.key==="Enter"&&setGame(g.id)}>
            <div className="gc-in">
              <div className="gc-head">
                <div className="gc-icon">{g.icon}</div>
                <span className={`badge ${g.badge==="ai"?"ba":"bc"}`}>{g.badge==="ai"?"🤖 AI":"CLASSIC"}</span>
              </div>
              <h3 className="gc-title">{g.title}</h3>
              <p className="gc-desc">{g.desc}</p>
              <div className="gc-foot">
                <button className="gc-play" onClick={e=>{e.stopPropagation();setGame(g.id);}}>PLAY →</button>
                <span className="gc-diff">{g.diff}</span>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  </main>);
}

// ═══════════════════════════════════════════════════════════════════
//  ABOUT
// ═══════════════════════════════════════════════════════════════════
function About(){
  const feats=[
    {icon:"🎮",t:"5 Browser Games",d:"Tic Tac Toe, Typing, Swipe, Menja & Puzzle — all fully playable."},
    {icon:"🤖",t:"AI Experiences",d:"Emotion Recognition & Voice Command — Python apps with webcam/mic."},
    {icon:"🏆",t:"Global Leaderboard",d:"Compete worldwide, climb the ranks, claim the top spot."},
    {icon:"🔐",t:"Secure Accounts",d:"JWT-secured login. Progress always tracked and saved."},
  ];
  return(<main className="page">
    <div className="sec">
      <span className="sec-eye">// About Us</span>
      <div className="ab-grid">
        <div className="ab-txt">
          <h2>We Built <span style={{background:"linear-gradient(90deg,#583cff,#ff2d78)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>GAME‑O‑HUB</span></h2>
          <p>Your one‑stop destination for fun, challenge, and innovation. Classic browser games and cutting‑edge AI experiences — all under one roof.</p>
          <p>Beat your typing speed, outsmart an AI at Tic Tac Toe, slash objects in Menja, or slide tiles in the puzzle. Every game tracks your score on the global leaderboard.</p>
        </div>
        <div className="ab-vis">
          {feats.map(f=>(
            <div key={f.t} className="afi">
              <div className="afi-ico">{f.icon}</div>
              <div><div className="afi-t">{f.t}</div><div className="afi-d">{f.d}</div></div>
            </div>
          ))}
        </div>
      </div>
      <div className="mission">
        <div className="mission-tag">Play. Compete. Win.</div>
        <p className="mission-txt">GAME‑O‑HUB highlights the power of AI while keeping the joy of traditional gameplay alive. All five browser games are fully playable with no installation — just open and play.</p>
      </div>
    </div>
  </main>);
}

// ═══════════════════════════════════════════════════════════════════
//  AUTH
// ═══════════════════════════════════════════════════════════════════
function Auth({onSuccess,auth}){
  const {login,signup,loading}=auth;
  const [tab,setTab]=useState("login");
  const [form,setForm]=useState({username:"",email:"",password:"",confirm:""});
  const [errs,setErrs]=useState({});
  const [apiErr,setApiErr]=useState("");
  const [ok,setOk]=useState("");
  const upd=(k,v)=>{setForm(f=>({...f,[k]:v}));setErrs(e=>({...e,[k]:""}));setApiErr("");};
  const validate=()=>{
    const e={};
    if(!form.username.trim())e.username="Username required.";
    else if(!/^[A-Za-z0-9_]{3,40}$/.test(form.username))e.username="3–40 chars: letters, numbers, underscores.";
    if(tab==="signup"&&!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email))e.email="Valid email required.";
    if(form.password.length<6)e.password="Min. 6 characters.";
    if(tab==="signup"&&form.password!==form.confirm)e.confirm="Passwords don't match.";
    return e;
  };
  const submit=async()=>{
    const e=validate();if(Object.keys(e).length){setErrs(e);return;}setApiErr("");
    const res=tab==="login"?await login(form.username.trim(),form.password):await signup(form.username.trim(),form.email.trim(),form.password);
    if(res.success){setOk(tab==="login"?"Welcome back! 🎮":"Account created! Let's play! 🎉");setTimeout(()=>onSuccess?.(),1000);}
    else setApiErr(res.error??"Something went wrong.");
  };
  const sw=t=>{setTab(t);setErrs({});setApiErr("");setOk("");};
  return(<main className="auth-pg">
    <div className="auth-card">
      <div className="auth-brand">
        <div className="auth-logo-box">🎮</div>
        <span className="auth-name">GAME-O-HUB</span>
        <span className="auth-sub">PLAY · COMPETE · WIN</span>
      </div>
      <div className="auth-tabs">
        <button className={`auth-tab ${tab==="login"?"on":""}`} onClick={()=>sw("login")}>Login</button>
        <button className={`auth-tab ${tab==="signup"?"on":""}`} onClick={()=>sw("signup")}>Sign Up</button>
      </div>
      {ok&&<div className="alrt alrt-ok">{ok}</div>}
      {apiErr&&<div className="alrt alrt-err">⚠️ {apiErr}</div>}
      <div className="fg">
        <label className="fl">Username</label>
        <input className={`fi ${errs.username?"err":""}`} placeholder="YourUsername" autoComplete="username"
          value={form.username} onChange={e=>upd("username",e.target.value)} onKeyDown={e=>e.key==="Enter"&&submit()}/>
        {errs.username&&<span className="fe">{errs.username}</span>}
      </div>
      {tab==="signup"&&<div className="fg">
        <label className="fl">Email</label>
        <input type="email" className={`fi ${errs.email?"err":""}`} placeholder="you@example.com"
          autoComplete="email" value={form.email} onChange={e=>upd("email",e.target.value)}/>
        {errs.email&&<span className="fe">{errs.email}</span>}
      </div>}
      <div className="fg">
        <label className="fl">Password</label>
        <input type="password" className={`fi ${errs.password?"err":""}`} placeholder="Min. 6 characters"
          autoComplete={tab==="login"?"current-password":"new-password"} value={form.password}
          onChange={e=>upd("password",e.target.value)} onKeyDown={e=>e.key==="Enter"&&submit()}/>
        {errs.password&&<span className="fe">{errs.password}</span>}
      </div>
      {tab==="signup"&&<div className="fg">
        <label className="fl">Confirm Password</label>
        <input type="password" className={`fi ${errs.confirm?"err":""}`} placeholder="Repeat password"
          autoComplete="new-password" value={form.confirm} onChange={e=>upd("confirm",e.target.value)}/>
        {errs.confirm&&<span className="fe">{errs.confirm}</span>}
      </div>}
      <button className="fsub" onClick={submit} disabled={loading}>
        {loading&&<span className="spin"/>}
        {tab==="login"?"LOGIN →":"CREATE ACCOUNT →"}
      </button>
      <p className="auth-sw">
        {tab==="login"?<>No account? <button onClick={()=>sw("signup")}>Sign up free</button></>
          :<>Have an account? <button onClick={()=>sw("login")}>Log in</button></>}
      </p>
    </div>
  </main>);
}

// ═══════════════════════════════════════════════════════════════════
//  LEADERBOARD
// ═══════════════════════════════════════════════════════════════════
function Leaderboard({user}){
  const [game,setGame]=useState("all");
  const [pg,setPg]=useState(1);
  const [loading,setLoad]=useState(false);
  const [spin,setSpin]=useState(false);
  const [upd,setUpd]=useState(()=>new Date());
  const PER=5;
  const all=MOCK_LB[game]??MOCK_LB.all;
  const entries=all.slice((pg-1)*PER,pg*PER);
  const pages=Math.ceil(all.length/PER);
  const chg=g=>{setGame(g);setPg(1);};
  const ref=async()=>{setSpin(true);setLoad(true);await new Promise(r=>setTimeout(r,700));setLoad(false);setSpin(false);setUpd(new Date());};
  const rc=r=>r===1?"r1c":r===2?"r2c":r===3?"r3c":"rnc";
  const sc=r=>r===1?"gd":r===2?"si":r===3?"br":"";
  const fmt=t=>new Date(t).toLocaleDateString("en-GB",{day:"2-digit",month:"short",year:"numeric"});
  return(<main className="page">
    <div className="lb-pg">
      <span className="sec-eye">// Rankings</span>
      <div style={{display:"flex",alignItems:"flex-end",justifyContent:"space-between",flexWrap:"wrap",gap:"1rem",marginBottom:"1.85rem"}}>
        <div>
          <h2 className="sec-h" style={{marginBottom:".2rem"}}>Leaderboard</h2>
          <p style={{color:"var(--muted)",fontSize:".85rem"}}>Top players across all GAME‑O‑HUB games</p>
        </div>
        <div className="lb-ctrl" style={{margin:0}}>
          <select className="lb-sel" value={game} onChange={e=>chg(e.target.value)}>
            {FILTERS.map(o=><option key={o.v} value={o.v}>{o.l}</option>)}
          </select>
          <button className="lb-ref" onClick={ref}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className={spin?"sp2":""}>
              <path d="M23 4v6h-6M1 20v-6h6"/><path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15"/>
            </svg>
            REFRESH
          </button>
          <span className="lb-upd">{upd.toLocaleTimeString()}</span>
        </div>
      </div>
      {user&&game!=="all"&&(<div className="lb-pb">
        <div><div className="lb-pb-l">Your Personal Best</div><div className="lb-pb-v">—</div></div>
        <div style={{color:"var(--muted)",fontSize:".85rem"}}>Game: <strong style={{color:"var(--text)"}}>{GL[game]}</strong></div>
        <div style={{color:"var(--dim)",fontSize:".72rem"}}>Play to set a record!</div>
      </div>)}
      <div className="lb-wrap">
        <table className="lb-t">
          <thead><tr>
            <th>Rank</th><th>Player</th>
            {game==="all"&&<th>Game</th>}
            <th>Score</th><th>Date</th>
          </tr></thead>
          <tbody>
            {loading?(Array.from({length:PER}).map((_,i)=>(
              <tr key={i}>{[30,110,game==="all"?90:undefined,78,85].filter(Boolean).map((w,j)=>(
                <td key={j}><div className="sk-b" style={{height:13,width:w}}/></td>
              ))}</tr>
            ))):entries.length===0?(
              <tr><td colSpan={game==="all"?5:4}><div className="lb-empty"><div className="lb-empty-i">🏆</div><p>No scores yet. Be the first!</p></div></td></tr>
            ):entries.map(e=>{
              const isMe=user&&e.username===user.username;
              return(<tr key={e.id} className={isMe?"me":""}>
                <td><div style={{display:"flex",alignItems:"center",gap:".35rem"}}><span className={`rb ${rc(e.rank)}`}>{e.rank}</span>{e.rank<=3&&<span>{["🥇","🥈","🥉"][e.rank-1]}</span>}</div></td>
                <td><div className="lb-pl">{e.username}{isMe&&<span className="me-chip">YOU</span>}</div></td>
                {game==="all"&&<td><span className="g-tag">{GL[e.game_name]??e.game_name}</span></td>}
                <td><span className={`sp-pill ${sc(e.rank)}`}>{e.score.toLocaleString()}</span></td>
                <td><span className="lb-date">{fmt(e.timestamp)}</span></td>
              </tr>);
            })}
          </tbody>
        </table>
      </div>
      {pages>1&&(<nav className="lb-pag">
        <button className="pg-b" onClick={()=>setPg(p=>Math.max(1,p-1))} disabled={pg===1}>← PREV</button>
        {Array.from({length:pages},(_,i)=>i+1).map(p=>(
          <button key={p} className={`pg-b ${pg===p?"on":""}`} onClick={()=>setPg(p)}>{p}</button>
        ))}
        <button className="pg-b" onClick={()=>setPg(p=>Math.min(pages,p+1))} disabled={pg===pages}>NEXT →</button>
      </nav>)}
    </div>
  </main>);
}

// ═══════════════════════════════════════════════════════════════════
//  TIC TAC TOE — FULLY FIXED AI
// ═══════════════════════════════════════════════════════════════════
function TicTacToe({onExit,submitScore}){
  const EMPTY=Array(9).fill(null);
  const [board,setBoard]=useState([...EMPTY]);
  const [xTurn,setXT]=useState(true);      // true = X's turn (human in VS AI)
  const [result,setResult]=useState(null); // {winner, line}
  const [scores,setScores]=useState({X:0,O:0,D:0});
  const [vsAI,setVsAI]=useState(true);
  const [moveCount,setMoveCount]=useState(0);
  const [pts,setPts]=useState(null);
  const [popCells,setPopCells]=useState(new Set());
  const aiThinking=useRef(false);

  // FIXED: AI move in separate effect, watches board + xTurn
  useEffect(()=>{
    if(!vsAI||xTurn||result||aiThinking.current)return;
    aiThinking.current=true;
    const delay=setTimeout(()=>{
      setBoard(prev=>{
        // Double-check it's still AI's turn and no winner
        if(checkWinner(prev))return prev;
        const empty=prev.filter(c=>!c);
        if(empty.length===0)return prev;

        const copy=[...prev];
        const move=getBestMove(copy);
        if(move===-1){aiThinking.current=false;return prev;}
        copy[move]="O";

        // Trigger pop animation
        setPopCells(s=>{const n=new Set(s);n.add(move);return n;});
        setTimeout(()=>setPopCells(s=>{const n=new Set(s);n.delete(move);return n;}),300);

        const newCount=prev.filter(Boolean).length+1;
        setMoveCount(newCount);

        const w=checkWinner(copy);
        if(w){
          setResult(w);
          if(w.winner==="O"){
            setScores(s=>({...s,O:s.O+1}));setPts(0);
          }else if(w.winner==="draw"){
            setScores(s=>({...s,D:s.D+1}));setPts(30);submitScore?.("tictactoe",30);
          }
        }else{
          setXT(true); // back to human
        }
        aiThinking.current=false;
        return copy;
      });
    },450);
    return()=>clearTimeout(delay);
  },[board,xTurn,vsAI,result]);

  const handleClick=useCallback(i=>{
    if(board[i]||result)return;
    if(vsAI&&!xTurn)return; // AI's turn, ignore clicks
    const next=[...board];
    const mark=vsAI?"X":(xTurn?"X":"O");
    next[i]=mark;

    setPopCells(s=>{const n=new Set(s);n.add(i);return n;});
    setTimeout(()=>setPopCells(s=>{const n=new Set(s);n.delete(i);return n;}),300);

    const newCount=moveCount+1;
    setMoveCount(newCount);

    const w=checkWinner(next);
    if(w){
      setResult(w);
      if(w.winner==="X"){
        const p=Math.max(100-newCount*5,50);
        setScores(s=>({...s,X:s.X+1}));setPts(p);submitScore?.("tictactoe",p);
      }else if(w.winner==="draw"){
        setScores(s=>({...s,D:s.D+1}));setPts(30);submitScore?.("tictactoe",30);
      }else{
        setScores(s=>({...s,O:s.O+1}));setPts(0);
      }
    }else{
      setXT(t=>!t);
    }
    setBoard(next);
  },[board,result,vsAI,xTurn,moveCount,submitScore]);

  const reset=()=>{
    setBoard([...EMPTY]);setXT(true);setResult(null);
    setMoveCount(0);setPts(null);setPopCells(new Set());aiThinking.current=false;
  };

  const statusText=()=>{
    if(result){
      if(result.winner==="draw")return"IT'S A DRAW!";
      if(result.winner==="X")return vsAI?"YOU WIN! 🎉":"PLAYER X WINS!";
      return vsAI?"AI WINS 🤖":"PLAYER O WINS!";
    }
    if(vsAI)return xTurn?"YOUR TURN  (X)":"AI THINKING…";
    return xTurn?"PLAYER X TURN":"PLAYER O TURN";
  };
  const stCls=()=>{
    if(!result)return"";
    if(result.winner==="draw")return"draw";
    if(result.winner==="X")return"win";
    return"lose";
  };
  const wl=result?.line??[];

  return(<div className="ttt-pg page">
    <div className="ttt-title">TIC TAC TOE</div>
    <div className="ttt-sub">GAME-O-HUB CLASSIC</div>
    <div className="ttt-mode">
      <button className={`mode-b ${vsAI?"on":""}`} onClick={()=>{setVsAI(true);reset();}}>VS AI</button>
      <button className={`mode-b ${!vsAI?"on":""}`} onClick={()=>{setVsAI(false);reset();}}>VS PLAYER</button>
    </div>
    <div className="ttt-sc">
      <div className={`sc-tile sc-x ${xTurn&&!result?"hi":""}`}>
        <div className="sc-lbl">{vsAI?"YOU":"P1"} (X)</div>
        <div className="sc-val">{scores.X}</div>
      </div>
      <div className="sc-tile sc-d">
        <div className="sc-lbl">DRAWS</div>
        <div className="sc-val">{scores.D}</div>
      </div>
      <div className={`sc-tile sc-o ${!xTurn&&!result?"hi":""}`}>
        <div className="sc-lbl">{vsAI?"AI":"P2"} (O)</div>
        <div className="sc-val">{scores.O}</div>
      </div>
    </div>
    <div className={`ttt-status ${stCls()}`}>{statusText()}</div>
    <div className="ttt-board">
      {board.map((cell,i)=>{
        const isClickable=!cell&&!result&&(!vsAI||xTurn);
        return(<div key={i}
          className={["cell",
            cell?cell:"",
            isClickable?"clickable":"",
            wl.includes(i)?"win-c":"",
            popCells.has(i)?"pop":"",
          ].filter(Boolean).join(" ")}
          onClick={()=>handleClick(i)}>
          {cell}
        </div>);
      })}
    </div>
    <div className="pts-earned">
      {pts!==null&&result?(pts>0?`+${pts} PTS EARNED`:"NO POINTS THIS ROUND"):""}
    </div>
    <div className="ttt-acts">
      <button className="ttt-btn ttt-bp" onClick={reset}>{result?"PLAY AGAIN":"RESET"}</button>
      <button className="ttt-btn ttt-bo" onClick={onExit}>← BACK TO HUB</button>
    </div>
  </div>);
}

// ═══════════════════════════════════════════════════════════════════
//  TYPING GAME
// ═══════════════════════════════════════════════════════════════════
function TypingGame({onExit,submitScore}){
  const [words]=useState(()=>genWords(100));
  const [cur,setCur]=useState(0);
  const [inp,setInp]=useState("");
  const [status,setStat]=useState([]);
  const [tl,setTl]=useState(60);
  const [started,setStart]=useState(false);
  const [done,setDone]=useState(false);
  const [wpm,setWpm]=useState(0);
  const [acc,setAcc]=useState(100);
  const ref=useRef(null);
  const timer=useRef(null);
  const t0=useRef(null);

  // Auto-focus input on mount
  useEffect(()=>{ref.current?.focus();},[]);
  const finish=useCallback((ok,tot)=>{
    clearInterval(timer.current);setDone(true);
    const el=(Date.now()-t0.current)/1000/60;
    const fw=Math.round(ok/Math.max(el,.01));
    const fa=tot>0?Math.round((ok/tot)*100):0;
    setWpm(fw);setAcc(fa);
    const p=Math.round(fw*(fa/100)*10);
    submitScore?.("typing",p);
  },[submitScore]);
  useEffect(()=>{
    if(!started||done)return;
    timer.current=setInterval(()=>setTl(t=>{if(t<=1){clearInterval(timer.current);return 0;}return t-1;}),1000);
    return()=>clearInterval(timer.current);
  },[started]);
  useEffect(()=>{
    if(tl===0&&started&&!done){const ok=status.filter(s=>s==="ok").length;finish(ok,status.length);}
  },[tl,started,done,status,finish]);
  const handleInp=e=>{
    const v=e.target.value;
    if(!started){setStart(true);t0.current=Date.now();}
    if(done)return;
    if(v.endsWith(" ")){
      const typed=v.trim();
      if(!typed){setInp("");return;} // ignore accidental space
      const exp=words[cur]??"";const s=typed===exp?"ok":"bad";
      const ns=[...status,s];setStat(ns);setCur(i=>i+1);setInp("");
      const ok=ns.filter(x=>x==="ok").length;
      const el=(Date.now()-t0.current)/1000/60;
      setWpm(Math.round(ok/Math.max(el,.01)));setAcc(Math.round((ok/ns.length)*100));
    }else setInp(v);
  };
  const reset=()=>{clearInterval(timer.current);setStat([]);setCur(0);setInp("");setTl(60);setStart(false);setDone(false);setWpm(0);setAcc(100);ref.current?.focus();};
  const okC=status.filter(s=>s==="ok").length;
  const finalPts=Math.round(wpm*(acc/100)*10);
  const visStart=Math.max(0,cur-5);
  return(<div className="typ-pg page">
    <div className="typ-title">TYPING GAME</div>
    <div className="typ-sub">TYPE THE WORDS · PRESS SPACE TO SUBMIT EACH WORD</div>
    <div className="typ-stats">
      {[["TIME",tl+"s","tm"],["WPM",wpm,"wpm"],["ACC",acc+"%","acc"],["CORRECT",okC,""]].map(([l,v,c])=>(
        <div key={l} className="typ-stat"><div className="ts-l">{l}</div><div className={`ts-v ${c}`}>{v}</div></div>
      ))}
    </div>
    <div className="typ-words">
      {words.slice(visStart,cur+30).map((w,ri)=>{
        const ai=visStart+ri;const cls=ai<cur?(status[ai]==="ok"?"ok":"bad"):ai===cur?"cur":"pend";
        return<span key={ai} className={`wt ${cls}`}>{w}</span>;
      })}
    </div>
    <input ref={ref} className="typ-inp" value={inp} onChange={handleInp} disabled={done}
      placeholder={started?"":"Start typing to begin — press Space after each word"}
      autoFocus autoComplete="off" autoCorrect="off" autoCapitalize="off" spellCheck={false}/>
    <div className="typ-acts">
      <button className="typ-btn tb-p" onClick={reset}>RESTART</button>
      <button className="typ-btn tb-o" onClick={onExit}>← BACK TO HUB</button>
    </div>
    {done&&<div className="res-ov">
      <div className="res-card">
        <div className="res-title">ROUND COMPLETE!</div>
        <div className="res-grid">
          {[["WPM",wpm,"wpm"],["ACCURACY",acc+"%","acc"],["CORRECT",okC,""],["ERRORS",status.length-okC,""]].map(([l,v,c])=>(
            <div key={l} className="typ-stat" style={{textAlign:"center"}}>
              <div className="ts-l">{l}</div>
              <div className={`ts-v ${c}`} style={l==="ERRORS"?{color:"var(--P)"}:{}}>{v}</div>
            </div>
          ))}
        </div>
        <div className="res-big">{finalPts}</div>
        <div className="res-pts">POINTS EARNED</div>
        <div className="typ-acts" style={{marginTop:"1.35rem"}}>
          <button className="typ-btn tb-p" onClick={reset}>PLAY AGAIN</button>
          <button className="typ-btn tb-o" onClick={onExit}>← HUB</button>
        </div>
      </div>
    </div>}
  </div>);
}

// ═══════════════════════════════════════════════════════════════════
//  SWIPE THE PLATE — FULLY PLAYABLE
// ═══════════════════════════════════════════════════════════════════
function SwipePlate({onExit,submitScore}){
  const [plates,setPlates]=useState([]);
  const [score,setScore]=useState(0);
  const [misses,setMisses]=useState(0);
  const [tl,setTl]=useState(30);
  const [started,setStarted]=useState(false);
  const [done,setDone]=useState(false);
  const [cursorPos,setCursorPos]=useState({x:-100,y:-100});
  const [missFlash,setMissFlash]=useState(false);
  const arenaRef=useRef(null);
  const timer=useRef(null);
  const spawnRef=useRef(null);
  const idRef=useRef(0);
  const MAX_MISSES=5;

  const EMOJIS=["🍽️","🥗","🍜","🍣","🍔","🌮","🍕","🥘"];

  const spawnPlate=useCallback(()=>{
    if(!arenaRef.current)return;
    const w=arenaRef.current.offsetWidth;const h=arenaRef.current.offsetHeight;
    const id=idRef.current++;
    const x=Math.random()*(w-70)+10;const y=Math.random()*(h-70)+10;
    const emoji=EMOJIS[Math.floor(Math.random()*EMOJIS.length)];
    const lifetime=2000+Math.random()*1500;
    setPlates(p=>[...p,{id,x,y,emoji,born:Date.now(),lifetime}]);
    setTimeout(()=>{
      setPlates(prev=>{
        const exists=prev.find(pl=>pl.id===id);
        if(exists){
          setMisses(m=>{
            const nm=m+1;
            setMissFlash(true);setTimeout(()=>setMissFlash(false),400);
            return nm;
          });
        }
        return prev.filter(pl=>pl.id!==id);
      });
    },lifetime);
  },[]);

  const start=()=>{
    setStarted(true);setScore(0);setMisses(0);setTl(30);setDone(false);setPlates([]);
    timer.current=setInterval(()=>setTl(t=>{if(t<=1){clearInterval(timer.current);return 0;}return t-1;}),1000);
    spawnRef.current=setInterval(spawnPlate,800);
    spawnPlate();
  };

  useEffect(()=>{
    if(tl===0&&started&&!done){
      clearInterval(spawnRef.current);setDone(true);
      submitScore?.("swipe",score);
    }
  },[tl,started,done,score]);

  useEffect(()=>{
    if(misses>=MAX_MISSES&&started&&!done){
      clearInterval(timer.current);clearInterval(spawnRef.current);setDone(true);
      submitScore?.("swipe",score);
    }
  },[misses,started,done,score]);

  useEffect(()=>()=>{clearInterval(timer.current);clearInterval(spawnRef.current);},[]);

  const catchPlate=id=>{
    setPlates(p=>p.filter(pl=>pl.id!==id));
    setScore(s=>s+10);
  };

  const handleMouseMove=e=>{
    if(!arenaRef.current)return;
    const rect=arenaRef.current.getBoundingClientRect();
    setCursorPos({x:e.clientX-rect.left,y:e.clientY-rect.top});
  };

  return(<div className="swipe-pg page">
    <div className="game-title-main" style={{background:"linear-gradient(90deg,#ff2d78,#583cff)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>SWIPE THE PLATE</div>
    <div className="game-sub-main">CLICK PLATES BEFORE THEY DISAPPEAR</div>
    <div className="hud-row">
      {[["SCORE",score,"sw-v sw-vg"],["MISSES",`${misses}/${MAX_MISSES}`,"sw-v"],["TIME",tl+"s","sw-v"]].map(([l,v,c])=>(
        <div key={l} className="swipe-stat"><div className="sw-l">{l}</div><div className={c}>{v}</div></div>
      ))}
    </div>
    <div className="swipe-arena" ref={arenaRef} onMouseMove={handleMouseMove}>
      <div className={`miss-flash ${missFlash?"show":""}`}/>
      <div className="swipe-cursor" style={{left:cursorPos.x,top:cursorPos.y}}/>
      {plates.map(pl=>(
        <div key={pl.id} className="plate" style={{left:pl.x,top:pl.y}}
          onClick={()=>catchPlate(pl.id)}>
          {pl.emoji}
        </div>
      ))}
      {!started&&!done&&(
        <div style={{position:"absolute",inset:0,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:"1rem",background:"rgba(4,4,14,.7)"}}>
          <div style={{fontSize:"3rem"}}>🍽️</div>
          <div style={{fontFamily:"Orbitron,monospace",fontSize:".8rem",color:"var(--text)",letterSpacing:".1em"}}>CLICK PLATES BEFORE THEY VANISH</div>
          <button className="game-start-btn" onClick={start}>START GAME</button>
        </div>
      )}
      {done&&(
        <div style={{position:"absolute",inset:0,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:"1rem",background:"rgba(4,4,14,.85)"}}>
          <div style={{fontFamily:"Orbitron,monospace",fontSize:"1rem",fontWeight:900,color:"var(--text)"}}>GAME OVER!</div>
          <div style={{fontFamily:"Orbitron,monospace",fontSize:"2.2rem",fontWeight:900,color:"var(--P)"}}>{score}</div>
          <div style={{color:"var(--muted)",fontSize:".78rem",letterSpacing:".1em"}}>POINTS</div>
          <button className="game-start-btn" onClick={start}>PLAY AGAIN</button>
        </div>
      )}
    </div>
    <button className="game-back" onClick={onExit}>← BACK TO HUB</button>
  </div>);
}

// ═══════════════════════════════════════════════════════════════════
//  MENJA (SLASH GAME) — FULLY PLAYABLE
// ═══════════════════════════════════════════════════════════════════
function Menja({onExit,submitScore}){
  const [objects,setObjects]=useState([]);
  const [slashes,setSlashes]=useState([]);
  const [score,setScore]=useState(0);
  const [lives,setLives]=useState(3);
  const [started,setStarted]=useState(false);
  const [done,setDone]=useState(false);
  const [mousePos,setMousePos]=useState({x:0,y:0});
  const [lastPos,setLastPos]=useState(null);
  const [explosions,setExplosions]=useState([]);
  const arenaRef=useRef(null);
  const spawnRef=useRef(null);
  const animRef=useRef(null);
  const idRef=useRef(0);
  const objectsRef=useRef([]);
  const scoreRef=useRef(0);
  const livesRef=useRef(3);

  const EMOJIS=["🍎","🍊","🍋","🍉","🍇","🍓","🥝","🍑","🍒","⭐","💎","🔮"];

  const spawnObj=useCallback(()=>{
    if(!arenaRef.current)return;
    const w=arenaRef.current.offsetWidth;
    const id=idRef.current++;
    const x=40+Math.random()*(w-80);
    const vy=-(6+Math.random()*4);
    const vx=(Math.random()-.5)*3;
    const emoji=EMOJIS[Math.floor(Math.random()*EMOJIS.length)];
    const obj={id,x,y:arenaRef.current.offsetHeight+30,vx,vy,emoji,size:50+Math.random()*20,slashed:false};
    objectsRef.current=[...objectsRef.current,obj];
    setObjects([...objectsRef.current]);
  },[]);

  const start=()=>{
    setStarted(true);setScore(0);setLives(3);setDone(false);
    setObjects([]);setSlashes([]);setExplosions([]);
    objectsRef.current=[];scoreRef.current=0;livesRef.current=3;
    idRef.current=0;

    spawnRef.current=setInterval(spawnObj,800);

    const loop=()=>{
      if(!arenaRef.current){animRef.current=requestAnimationFrame(loop);return;}
      const h=arenaRef.current.offsetHeight;
      let lost=false;
      objectsRef.current=objectsRef.current
        .map(o=>({...o,x:o.x+o.vx,y:o.y+o.vy,vy:o.vy+0.35}))
        .filter(o=>{
          if(!o.slashed&&o.y>h+60){
            livesRef.current=livesRef.current-1;
            setLives(livesRef.current);
            if(livesRef.current<=0)lost=true;
            return false;
          }
          return o.y<h+100&&o.x>-80&&o.x<(arenaRef.current?.offsetWidth??500)+80;
        });
      setObjects([...objectsRef.current]);
      if(lost){
        clearInterval(spawnRef.current);cancelAnimationFrame(animRef.current);
        setDone(true);submitScore?.("menja",scoreRef.current);return;
      }
      animRef.current=requestAnimationFrame(loop);
    };
    animRef.current=requestAnimationFrame(loop);
  };

  useEffect(()=>()=>{clearInterval(spawnRef.current);cancelAnimationFrame(animRef.current);},[]);

  const handleMouseMove=e=>{
    if(!arenaRef.current||!started||done)return;
    const rect=arenaRef.current.getBoundingClientRect();
    const x=e.clientX-rect.left;const y=e.clientY-rect.top;
    if(lastPos){
      // Check slash against all objects
      objectsRef.current=objectsRef.current.map(o=>{
        if(o.slashed)return o;
        const cx=o.x+o.size/2;const cy=o.y+o.size/2;
        // Distance from point to line segment
        const dx=x-lastPos.x;const dy=y-lastPos.y;
        const len=Math.sqrt(dx*dx+dy*dy);
        if(len===0)return o;
        const t=Math.max(0,Math.min(1,((cx-lastPos.x)*dx+(cy-lastPos.y)*dy)/(len*len)));
        const px=lastPos.x+t*dx;const py=lastPos.y+t*dy;
        const dist=Math.sqrt((cx-px)**2+(cy-py)**2);
        if(dist<o.size/2+8){
          scoreRef.current+=10;setScore(scoreRef.current);
          const expId=idRef.current++;
          setExplosions(ex=>[...ex,{id:expId,x:cx,y:cy}]);
          setTimeout(()=>setExplosions(ex=>ex.filter(e=>e.id!==expId)),400);
          return {...o,slashed:true};
        }
        return o;
      });
      setObjects([...objectsRef.current]);

      // Add slash trail
      const slashId=idRef.current++;
      const angle=Math.atan2(y-lastPos.y,x-lastPos.x)*180/Math.PI;
      const length=Math.sqrt((x-lastPos.x)**2+(y-lastPos.y)**2);
      setSlashes(s=>[...s,{id:slashId,x:lastPos.x,y:lastPos.y,angle,length}]);
      setTimeout(()=>setSlashes(s=>s.filter(sl=>sl.id!==slashId)),350);
    }
    setLastPos({x,y});setMousePos({x,y});
  };

  return(<div className="menja-pg page">
    <div className="game-title-main" style={{background:"linear-gradient(90deg,#ff2d78,#583cff)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>MENJA</div>
    <div className="game-sub-main">SLASH OBJECTS WITH YOUR MOUSE</div>
    <div className="menja-hud">
      {[["SCORE",score],["LIVES",""]].map(([l,v])=>(
        <div key={l} className="hud-box"><div className="hud-l">{l}</div>
          {l==="LIVES"?<div className="menja-lives">{Array.from({length:3},(_,i)=><span key={i}>{i<lives?"❤️":"🖤"}</span>)}</div>
          :<div className="hud-v" style={{color:"var(--P)"}}>{v}</div>}
        </div>
      ))}
    </div>
    <div className="menja-canvas-wrap" ref={arenaRef} onMouseMove={handleMouseMove} onMouseLeave={()=>setLastPos(null)}>
      {slashes.map(s=>(
        <div key={s.id} className="menja-slash" style={{left:s.x,top:s.y,width:s.length,transform:`rotate(${s.angle}deg)`}}/>
      ))}
      {explosions.map(e=>(
        <div key={e.id} className="menja-explosion" style={{left:e.x,top:e.y}}/>
      ))}
      {objects.filter(o=>!o.slashed).map(o=>(
        <div key={o.id} className="menja-obj" style={{left:o.x,top:o.y,width:o.size,height:o.size,fontSize:o.size*.6}}>
          {o.emoji}
        </div>
      ))}
      {!started&&!done&&(
        <div style={{position:"absolute",inset:0,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:"1rem",background:"rgba(4,4,14,.75)"}}>
          <div style={{fontSize:"2.8rem"}}>⚔️</div>
          <div style={{fontFamily:"Orbitron,monospace",fontSize:".78rem",color:"var(--text)",letterSpacing:".1em",textAlign:"center",maxWidth:280}}>MOVE YOUR MOUSE FAST TO SLASH OBJECTS. DON'T LET THEM FALL!</div>
          <button className="game-start-btn" onClick={start}>START SLASHING</button>
        </div>
      )}
      {done&&(
        <div style={{position:"absolute",inset:0,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:".9rem",background:"rgba(4,4,14,.88)"}}>
          <div style={{fontFamily:"Orbitron,monospace",fontSize:"1rem",fontWeight:900,color:"var(--text)"}}>GAME OVER!</div>
          <div style={{fontFamily:"Orbitron,monospace",fontSize:"2.2rem",fontWeight:900,color:"var(--P)"}}>{score}</div>
          <div style={{color:"var(--muted)",fontSize:".75rem",letterSpacing:".1em"}}>POINTS</div>
          <button className="game-start-btn" onClick={start}>PLAY AGAIN</button>
        </div>
      )}
    </div>
    <button className="game-back" onClick={onExit}>← BACK TO HUB</button>
  </div>);
}

// ═══════════════════════════════════════════════════════════════════
//  PUZZLE (SLIDING TILE) — FULLY PLAYABLE
// ═══════════════════════════════════════════════════════════════════
function Puzzle({onExit,submitScore}){
  const SIZE=4;const TOTAL=SIZE*SIZE;
  const [tiles,setTiles]=useState([]);
  const [moves,setMoves]=useState(0);
  const [started,setStarted]=useState(false);
  const [done,setDone]=useState(false);
  const [tl,setTl]=useState(0);
  const [animTile,setAnimTile]=useState(null);
  const timer=useRef(null);

  const isSolved=t=>t.every((v,i)=>v===(i===TOTAL-1?0:i+1));

  const shuffle=arr=>{
    let a=[...arr];
    // Do many random valid moves to shuffle
    let blank=a.indexOf(0);
    for(let k=0;k<200;k++){
      const row=Math.floor(blank/SIZE);const col=blank%SIZE;
      const moves=[];
      if(row>0)moves.push(blank-SIZE);if(row<SIZE-1)moves.push(blank+SIZE);
      if(col>0)moves.push(blank-1);if(col<SIZE-1)moves.push(blank+1);
      const mv=moves[Math.floor(Math.random()*moves.length)];
      [a[blank],a[mv]]=[a[mv],a[blank]];blank=mv;
    }
    return a;
  };

  const start=()=>{
    const init=Array.from({length:TOTAL},(_,i)=>i===TOTAL-1?0:i+1);
    setTiles(shuffle(init));setMoves(0);setStarted(true);setDone(false);setTl(0);
    clearInterval(timer.current);
    timer.current=setInterval(()=>setTl(t=>t+1),1000);
  };

  useEffect(()=>()=>clearInterval(timer.current),[]);

  const click=i=>{
    if(!started||done)return;
    const blank=tiles.indexOf(0);const row=Math.floor(i/SIZE);const col=i%SIZE;
    const br=Math.floor(blank/SIZE);const bc=blank%SIZE;
    const adj=(row===br&&Math.abs(col-bc)===1)||(col===bc&&Math.abs(row-br)===1);
    if(!adj)return;
    const next=[...tiles];[next[blank],next[i]]=[next[i],next[blank]];
    setAnimTile(i);setTimeout(()=>setAnimTile(null),150);
    setMoves(m=>m+1);
    setTiles(next);
    if(isSolved(next)){
      clearInterval(timer.current);setDone(true);
      const pts=Math.max(1000-moves*5-tl*2,100);
      submitScore?.("puzzle",pts);
    }
  };

  const TILE_SIZE=SIZE===4?72:90;
  const GAP=4;
  const blank=tiles.indexOf(0);

  return(<div className="puzzle-pg page">
    <div className="game-title-main" style={{background:"linear-gradient(90deg,#00e4ff,#ff2d78)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>SLIDING PUZZLE</div>
    <div className="game-sub-main">SLIDE TILES TO ORDER THEM 1–{TOTAL-1}</div>
    {started&&(<div className="hud-row">
      {[["MOVES",moves],["TIME",tl+"s"]].map(([l,v])=>(
        <div key={l} className="hud-box"><div className="hud-l">{l}</div><div className="hud-v" style={{color:"var(--C)"}}>{v}</div></div>
      ))}
    </div>)}
    <div className="puzzle-board" style={{gridTemplateColumns:`repeat(${SIZE},${TILE_SIZE}px)`,gap:GAP}}>
      {tiles.map((v,i)=>{
        const isBk=v===0;const row=Math.floor(i/SIZE);const col=i%SIZE;
        const adjBlank=(Math.floor(blank/SIZE)===row&&Math.abs(blank%SIZE-col)===1)||(blank%SIZE===col&&Math.abs(Math.floor(blank/SIZE)-row)===1);
        const solved=started&&!isBk&&v===i+1;
        return(<div key={`${i}-${v}`}
          className={["puzzle-tile",isBk?"empty":"",!isBk&&adjBlank&&started?"":"",solved?"solved-t":"",animTile===i?"slide":""].filter(Boolean).join(" ")}
          style={{width:TILE_SIZE,height:TILE_SIZE,
            background:isBk?"":solved?`linear-gradient(135deg,rgba(26,255,140,.15),rgba(0,228,255,.08))`:`linear-gradient(135deg,rgba(88,60,255,.2),rgba(88,60,255,.06))`,
            border:isBk?"2px dashed rgba(0,228,255,.12)":solved?"2px solid rgba(26,255,140,.4)":"2px solid rgba(88,60,255,.28)",
            fontSize:SIZE===4?"1.3rem":"1.6rem",fontFamily:"Orbitron,monospace",fontWeight:900,
            color:solved?"var(--G)":isBk?"transparent":"var(--text)",cursor:adjBlank&&!isBk&&started?"pointer":"default",
            borderRadius:8,display:"flex",alignItems:"center",justifyContent:"center",transition:"all .15s"}}
          onClick={()=>click(i)}>
          {isBk?"":v}
        </div>);
      })}
    </div>
    {!started&&(<div style={{marginTop:"1.4rem",display:"flex",gap:".65rem",justifyContent:"center",position:"relative",zIndex:1}}>
      <button className="game-start-btn" onClick={start}>START PUZZLE</button>
      <button className="game-back" style={{marginTop:0}} onClick={onExit}>← BACK</button>
    </div>)}
    {started&&!done&&(<div style={{marginTop:"1rem",display:"flex",gap:".65rem",justifyContent:"center",position:"relative",zIndex:1}}>
      <button className="game-start-btn" style={{fontSize:".55rem",padding:".55rem 1.1rem"}} onClick={start}>SHUFFLE AGAIN</button>
      <button className="game-back" style={{marginTop:0}} onClick={onExit}>← BACK</button>
    </div>)}
    {done&&(<div className="puzzle-complete">
      <div className="puzzle-win-card">
        <div style={{fontSize:"2.5rem",marginBottom:".75rem"}}>🎉</div>
        <div style={{fontFamily:"Orbitron,monospace",fontSize:"1rem",fontWeight:900,marginBottom:"1.2rem"}}>PUZZLE SOLVED!</div>
        <div className="hud-row" style={{justifyContent:"center"}}>
          {[["MOVES",moves],["TIME",tl+"s"],["SCORE",Math.max(1000-moves*5-tl*2,100)]].map(([l,v])=>(
            <div key={l} className="hud-box"><div className="hud-l">{l}</div><div className="hud-v" style={{color:"var(--G)"}}>{v}</div></div>
          ))}
        </div>
        <div style={{display:"flex",gap:".65rem",justifyContent:"center",marginTop:"1.2rem"}}>
          <button className="game-start-btn" onClick={start}>PLAY AGAIN</button>
          <button className="game-back" style={{marginTop:0}} onClick={onExit}>← HUB</button>
        </div>
      </div>
    </div>)}
  </div>);
}

// ═══════════════════════════════════════════════════════════════════
//  AI GAMES — INTEGRATED SETUP + LAUNCH SCREEN
// ═══════════════════════════════════════════════════════════════════

const AI_GAME_DATA = {
  emotion: {
    title: "Emotion Recognition",
    icon: "😄",
    accent: "linear-gradient(90deg,#ff2d78,#583cff)",
    accentRgb: "255,45,120",
    tagline: "Your face is the controller",
    description: "Match target emotions on screen using your real face. DeepFace reads your webcam in real-time — smile, frown, look surprised to score points.",
    hardware: "Webcam (optional — has simulation fallback)",
    fallback: "No webcam? Runs in SIMULATION MODE — emotions are randomly generated so you can still see the full UI and gameplay.",
    fallbackIcon: "🖥️",
    runCmd: "python emotion/emotion_game.py",
    tokenCmd: "python emotion/emotion_game.py --token YOUR_JWT_TOKEN",
    deps: "pip install pygame opencv-python deepface tf-keras requests",
    controls: [
      ["Enter", "Start game / Play again"],
      ["ESC", "Back to menu / Quit"],
      ["Your face 😄", "Match the emoji shown on screen"],
    ],
    troubleshoot: [
      ["ModuleNotFoundError: pygame", "pip install pygame"],
      ["ModuleNotFoundError: cv2", "pip install opencv-python"],
      ["ModuleNotFoundError: deepface", "pip install deepface tf-keras"],
      ["Shows 'simulation'", "deepface OK, but no webcam — plug one in"],
      ["First run is slow", "DeepFace downloads models (~500MB) on first use"],
      ["TensorFlow errors", "pip install tf-keras then restart terminal"],
    ],
  },
  voice: {
    title: "Voice Command Maze",
    icon: "🎙️",
    accent: "linear-gradient(90deg,#00e4ff,#ff2d78)",
    accentRgb: "0,228,255",
    tagline: "Speak to navigate the labyrinth",
    description: "Navigate a procedurally-generated maze using only your voice. Say \"up\", \"left\", \"right\", \"down\" to move. Collect coins, reach the exit before time runs out.",
    hardware: "Microphone (optional — has keyboard fallback)",
    fallback: "No mic? Runs in KEYBOARD MODE — use W A S D or arrow keys instead. Full gameplay, no voice needed.",
    fallbackIcon: "⌨️",
    runCmd: "python voice/voice_game.py",
    tokenCmd: "python voice/voice_game.py --token YOUR_JWT_TOKEN",
    deps: "pip install pygame SpeechRecognition requests\n# + pyaudio (see setup below)",
    controls: [
      ["\"up\" / \"north\"", "Move up"],
      ["\"down\" / \"south\"", "Move down"],
      ["\"left\" / \"west\"", "Move left"],
      ["\"right\" / \"east\"", "Move right"],
      ["W A S D / ↑↓←→", "Keyboard fallback"],
    ],
    pyaudioNote: {
      windows: "pip install pipwin && pipwin install pyaudio",
      mac: "brew install portaudio && pip install pyaudio",
      linux: "sudo apt install python3-pyaudio && pip install pyaudio",
    },
    troubleshoot: [
      ["ModuleNotFoundError: pygame", "pip install pygame"],
      ["Shows 'KEYBOARD MODE'", "pip install SpeechRecognition pyaudio, then rerun"],
      ["OSError: [Errno -9996] PyAudio", "Set your default microphone in OS sound settings"],
      ["No voice detected", "Speak clearly after the beep; check mic permissions"],
    ],
  },
};

function CopyButton({text}){
  const [copied,setCopied]=useState(false);
  const copy=()=>{
    const done=()=>{setCopied(true);setTimeout(()=>setCopied(false),1800);};
    if(navigator.clipboard){
      navigator.clipboard.writeText(text).then(done).catch(()=>{
        // fallback on permission denial
        try{const ta=document.createElement("textarea");ta.value=text;document.body.appendChild(ta);ta.select();document.execCommand("copy");document.body.removeChild(ta);done();}catch(e){}
      });
    }else{
      try{const ta=document.createElement("textarea");ta.value=text;document.body.appendChild(ta);ta.select();document.execCommand("copy");document.body.removeChild(ta);done();}catch(e){}
    }
  };
  return(
    <button onClick={copy} style={{background:"transparent",border:"1px solid rgba(255,255,255,.15)",borderRadius:4,
      color:copied?"var(--G)":"var(--muted)",fontFamily:"JetBrains Mono,monospace",fontSize:".56rem",
      padding:".2rem .55rem",cursor:"pointer",transition:"all .2s",flexShrink:0,letterSpacing:".08em"}}>
      {copied?"✓ COPIED":"COPY"}
    </button>
  );
}

function CodeBlock({label,code,accent}){
  return(
    <div style={{background:"var(--ink3)",border:"1px solid rgba(255,255,255,.07)",borderRadius:8,
      overflow:"hidden",marginBottom:".7rem"}}>
      {label&&<div style={{padding:".35rem .88rem",borderBottom:"1px solid rgba(255,255,255,.05)",
        fontSize:".52rem",letterSpacing:".18em",color:"var(--muted)",fontFamily:"JetBrains Mono,monospace",
        textTransform:"uppercase"}}>{label}</div>}
      <div style={{display:"flex",alignItems:"center",gap:".6rem",padding:".7rem .88rem"}}>
        <code style={{fontFamily:"JetBrains Mono,monospace",fontSize:".72rem",color:"var(--C)",
          flex:1,wordBreak:"break-all",lineHeight:1.6,whiteSpace:"pre-wrap"}}>{code}</code>
        <CopyButton text={code}/>
      </div>
    </div>
  );
}

function AIGameInfo({gameId,onExit}){
  const d=AI_GAME_DATA[gameId]??AI_GAME_DATA.emotion;
  const [tab,setTab]=useState("setup"); // setup | play | controls | tips
  const TABS=[{id:"setup",l:"⚙️ Setup"},{id:"play",l:"▶ Launch"},{id:"controls",l:"🕹️ Controls"},{id:"tips",l:"🔧 Help"}];

  return(
    <div className="page" style={{minHeight:"100vh",padding:"2rem 1.5rem 4rem",
      background:`radial-gradient(ellipse 55% 55% at 50% 20%,rgba(${d.accentRgb},.1) 0%,transparent 65%)`}}>
      <div style={{maxWidth:680,margin:"0 auto"}}>

        {/* Header */}
        <div style={{textAlign:"center",marginBottom:"1.8rem"}}>
          <div style={{fontSize:"3.5rem",marginBottom:".7rem",
            filter:`drop-shadow(0 0 24px rgba(${d.accentRgb},.5))`}}>{d.icon}</div>
          <div style={{fontFamily:"JetBrains Mono,monospace",fontSize:".58rem",letterSpacing:".22em",
            color:"var(--muted)",textTransform:"uppercase",marginBottom:".4rem"}}>AI GAME</div>
          <h2 style={{fontFamily:"Orbitron,monospace",fontSize:"clamp(1.2rem,3vw,1.8rem)",fontWeight:900,
            marginBottom:".45rem",background:d.accent,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>{d.title}</h2>
          <p style={{color:"var(--muted)",fontSize:".85rem",lineHeight:1.7,maxWidth:480,margin:"0 auto"}}>{d.description}</p>
        </div>

        {/* Fallback banner */}
        <div style={{background:`rgba(${d.accentRgb},.07)`,border:`1px solid rgba(${d.accentRgb},.25)`,
          borderRadius:10,padding:".9rem 1.1rem",marginBottom:"1.4rem",display:"flex",gap:".75rem",alignItems:"flex-start"}}>
          <span style={{fontSize:"1.3rem",flexShrink:0}}>{d.fallbackIcon}</span>
          <div>
            <div style={{fontFamily:"Orbitron,monospace",fontSize:".58rem",fontWeight:700,
              letterSpacing:".12em",color:"var(--text)",marginBottom:".2rem"}}>NO HARDWARE? NO PROBLEM</div>
            <div style={{color:"var(--muted)",fontSize:".8rem",lineHeight:1.65}}>{d.fallback}</div>
          </div>
        </div>

        {/* Tabs */}
        <div style={{display:"flex",background:"var(--ink2)",border:"1px solid var(--border2)",
          borderRadius:8,padding:3,marginBottom:"1.4rem",gap:2}}>
          {TABS.map(t=>(
            <button key={t.id} onClick={()=>setTab(t.id)} style={{flex:1,background:tab===t.id?"var(--V)":"transparent",
              color:tab===t.id?"#fff":"var(--muted)",fontFamily:"Orbitron,monospace",fontSize:".5rem",
              fontWeight:700,letterSpacing:".1em",padding:".5rem .3rem",borderRadius:6,border:"none",
              cursor:"pointer",transition:"all .2s",whiteSpace:"nowrap"}}>{t.l}</button>
          ))}
        </div>

        {/* TAB: SETUP */}
        {tab==="setup"&&<div>
          <div style={{fontFamily:"Orbitron,monospace",fontSize:".62rem",fontWeight:700,
            letterSpacing:".14em",color:"var(--text)",marginBottom:".85rem"}}>STEP 1 — INSTALL PYTHON</div>
          <p style={{color:"var(--muted)",fontSize:".83rem",marginBottom:"1rem",lineHeight:1.7}}>
            Download Python 3.10 or 3.11 from{" "}
            <a href="https://python.org" target="_blank" rel="noreferrer"
              style={{color:"var(--C)",textDecoration:"underline"}}>python.org</a>.{" "}
            On Windows, check <strong style={{color:"var(--text)"}}>✅ "Add Python to PATH"</strong> during install.
          </p>
          <div style={{fontFamily:"Orbitron,monospace",fontSize:".62rem",fontWeight:700,
            letterSpacing:".14em",color:"var(--text)",marginBottom:".85rem"}}>STEP 2 — INSTALL DEPENDENCIES</div>
          <p style={{color:"var(--muted)",fontSize:".8rem",marginBottom:".65rem"}}>Open a terminal and run:</p>
          <CodeBlock label="Install packages" code={d.deps}/>
          {d.pyaudioNote&&<>
            <p style={{color:"var(--muted)",fontSize:".8rem",margin:".8rem 0 .55rem"}}>
              <strong style={{color:"var(--text)"}}>pyaudio</strong> needs an extra step depending on OS:
            </p>
            <CodeBlock label="Windows" code={d.pyaudioNote.windows}/>
            <CodeBlock label="macOS" code={d.pyaudioNote.mac}/>
            <CodeBlock label="Linux" code={d.pyaudioNote.linux}/>
          </>}
          <div style={{fontFamily:"Orbitron,monospace",fontSize:".62rem",fontWeight:700,
            letterSpacing:".14em",color:"var(--text)",margin:"1.2rem 0 .85rem"}}>STEP 3 — NAVIGATE TO THE FOLDER</div>
          <CodeBlock label="Terminal" code={`cd path/to/ai-games`}/>
          <div style={{background:"rgba(26,255,140,.06)",border:"1px solid rgba(26,255,140,.22)",
            borderRadius:8,padding:".8rem 1rem",marginTop:".9rem",fontSize:".8rem",color:"var(--G)",lineHeight:1.65}}>
            ✅ Done? Switch to the <strong>Launch</strong> tab to run the game.
          </div>
        </div>}

        {/* TAB: LAUNCH */}
        {tab==="play"&&<div>
          <div style={{fontFamily:"Orbitron,monospace",fontSize:".62rem",fontWeight:700,
            letterSpacing:".14em",color:"var(--text)",marginBottom:".85rem"}}>RUN THE GAME</div>
          <CodeBlock label="Basic (no score saving)" code={d.runCmd}/>
          <div style={{fontFamily:"Orbitron,monospace",fontSize:".62rem",fontWeight:700,
            letterSpacing:".14em",color:"var(--text)",margin:"1.2rem 0 .85rem"}}>SUBMIT SCORES TO LEADERBOARD</div>
          <p style={{color:"var(--muted)",fontSize:".8rem",marginBottom:".65rem",lineHeight:1.65}}>
            Log in on this site, then get your token from DevTools (F12) →&nbsp;
            Network tab → login request → Response → <code style={{color:"var(--C)",fontSize:".75rem"}}>access_token</code>.
          </p>
          <CodeBlock label="With score submission" code={d.tokenCmd}/>
          <div style={{background:`rgba(${d.accentRgb},.07)`,border:`1px solid rgba(${d.accentRgb},.2)`,
            borderRadius:10,padding:"1rem 1.1rem",marginTop:"1.1rem"}}>
            <div style={{fontFamily:"Orbitron,monospace",fontSize:".58rem",fontWeight:700,
              letterSpacing:".12em",color:"var(--text)",marginBottom:".5rem"}}>HARDWARE REQUIRED</div>
            <div style={{color:"var(--muted)",fontSize:".82rem",lineHeight:1.65}}>
              {d.hardware}<br/>
              <span style={{color:"var(--G)",fontSize:".78rem"}}>↳ {d.fallback}</span>
            </div>
          </div>
        </div>}

        {/* TAB: CONTROLS */}
        {tab==="controls"&&<div>
          <div style={{fontFamily:"Orbitron,monospace",fontSize:".62rem",fontWeight:700,
            letterSpacing:".14em",color:"var(--text)",marginBottom:".85rem"}}>CONTROLS</div>
          <div style={{background:"var(--ink2)",border:"1px solid var(--border2)",borderRadius:10,overflow:"hidden"}}>
            {d.controls.map(([k,v],i)=>(
              <div key={i} style={{display:"flex",alignItems:"center",padding:".75rem 1.1rem",
                borderBottom:i<d.controls.length-1?"1px solid rgba(88,60,255,.07)":"none",
                background:i%2===0?"transparent":"rgba(88,60,255,.03)"}}>
                <code style={{fontFamily:"JetBrains Mono,monospace",fontSize:".72rem",color:"var(--C)",
                  minWidth:180,flexShrink:0}}>{k}</code>
                <span style={{color:"var(--muted)",fontSize:".82rem"}}>{v}</span>
              </div>
            ))}
          </div>
          {gameId==="voice"&&<div style={{marginTop:"1.2rem",background:"rgba(0,228,255,.06)",
            border:"1px solid rgba(0,228,255,.2)",borderRadius:10,padding:".9rem 1.1rem"}}>
            <div style={{fontFamily:"Orbitron,monospace",fontSize:".58rem",fontWeight:700,
              color:"var(--C)",marginBottom:".4rem",letterSpacing:".12em"}}>VOICE TIPS</div>
            <ul style={{color:"var(--muted)",fontSize:".8rem",lineHeight:1.8,paddingLeft:"1.2rem"}}>
              <li>Speak clearly and naturally after the beep</li>
              <li>Google's free speech API is used — requires internet</li>
              <li>Short commands work best: "left", "up", "right"</li>
              <li>WASD always works as a fallback</li>
            </ul>
          </div>}
          {gameId==="emotion"&&<div style={{marginTop:"1.2rem",background:"rgba(255,45,120,.06)",
            border:"1px solid rgba(255,45,120,.2)",borderRadius:10,padding:".9rem 1.1rem"}}>
            <div style={{fontFamily:"Orbitron,monospace",fontSize:".58rem",fontWeight:700,
              color:"var(--P)",marginBottom:".4rem",letterSpacing:".12em"}}>EMOTION TIPS</div>
            <ul style={{color:"var(--muted)",fontSize:".8rem",lineHeight:1.8,paddingLeft:"1.2rem"}}>
              <li>😄 Happy — smile big with teeth</li>
              <li>😢 Sad — frown and droop your eyes</li>
              <li>😠 Angry — furrow brows, clench jaw</li>
              <li>😲 Surprised — wide eyes, open mouth</li>
              <li>😐 Neutral — relax your face completely</li>
              <li>Hold the emotion for 1.2s to score</li>
            </ul>
          </div>}
        </div>}

        {/* TAB: TROUBLESHOOT */}
        {tab==="tips"&&<div>
          <div style={{fontFamily:"Orbitron,monospace",fontSize:".62rem",fontWeight:700,
            letterSpacing:".14em",color:"var(--text)",marginBottom:".85rem"}}>TROUBLESHOOTING</div>
          <div style={{background:"var(--ink2)",border:"1px solid var(--border2)",borderRadius:10,overflow:"hidden"}}>
            {d.troubleshoot.map(([prob,fix],i)=>(
              <div key={i} style={{padding:".85rem 1.1rem",
                borderBottom:i<d.troubleshoot.length-1?"1px solid rgba(88,60,255,.07)":"none"}}>
                <div style={{fontFamily:"JetBrains Mono,monospace",fontSize:".7rem",
                  color:"var(--P)",marginBottom:".3rem"}}>{prob}</div>
                <div style={{color:"var(--muted)",fontSize:".8rem"}}>→ <code style={{color:"var(--C)",
                  fontFamily:"JetBrains Mono,monospace",fontSize:".72rem"}}>{fix}</code></div>
              </div>
            ))}
          </div>
          <div style={{marginTop:"1.2rem",background:"rgba(88,60,255,.07)",border:"1px solid rgba(88,60,255,.2)",
            borderRadius:10,padding:".9rem 1.1rem",fontSize:".82rem",color:"var(--muted)",lineHeight:1.7}}>
            Still stuck? The <code style={{color:"var(--C)",fontFamily:"JetBrains Mono,monospace",fontSize:".75rem"}}>ai-games/README.md</code>{" "}
            file included in the zip has full setup instructions for Windows, macOS and Linux.
          </div>
        </div>}

        {/* Back button */}
        <div style={{display:"flex",justifyContent:"center",marginTop:"2rem"}}>
          <button className="btn btn-g" onClick={onExit}>← BACK TO HUB</button>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
//  FOOTER
// ═══════════════════════════════════════════════════════════════════
function Footer({setPage}){
  return(<footer className="ft">
    <div className="ft-logo">GAME-O-HUB</div>
    <p className="ft-copy">© 2025 GAME-O-HUB. All rights reserved.</p>
    <nav className="ft-links">
      {[["About","about"],["Leaderboard","leaderboard"],["Login","auth"]].map(([l,p])=>(
        <button key={p} className="ft-lk" onClick={()=>setPage(p)}>{l}</button>
      ))}
    </nav>
  </footer>);
}

// ═══════════════════════════════════════════════════════════════════
//  ROOT APP
// ═══════════════════════════════════════════════════════════════════
export default function App(){
  const [page,setPage]=useState("home");
  const [game,setGame]=useState(null);
  const auth=useAuth();
  const {user}=auth;

  useEffect(()=>{
    const s=document.createElement("style");s.textContent=CSS;document.head.appendChild(s);
    document.title="GAME-O-HUB — Play. Compete. Win.";
    const fav=document.createElement("link");fav.rel="icon";
    fav.href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect width='100' height='100' rx='20' fill='%23583cff'/><text y='.9em' font-size='75' x='12'>🎮</text></svg>";
    document.head.appendChild(fav);
    return()=>{document.head.removeChild(s);};
  },[]);

  useEffect(()=>{
    const titles={home:"GAME-O-HUB — Play. Compete. Win.",about:"About — GAME-O-HUB",auth:"Login — GAME-O-HUB",leaderboard:"Leaderboard — GAME-O-HUB"};
    if(!game)document.title=titles[page]??"GAME-O-HUB";
  },[page,game]);

  // GAME ROUTER
  if(game){
    const props={onExit:()=>setGame(null),submitScore:auth.submitScore};
    switch(game){
      case "tictactoe": return <TicTacToe {...props}/>;
      case "typing":    return <TypingGame {...props}/>;
      case "swipe":     return <SwipePlate {...props}/>;
      case "menja":     return <Menja {...props}/>;
      case "puzzle":    return <Puzzle {...props}/>;
      case "emotion":   return <AIGameInfo gameId="emotion" onExit={props.onExit}/>;
      case "voice":     return <AIGameInfo gameId="voice" onExit={props.onExit}/>;
      default:          return <AIGameInfo gameId="emotion" onExit={props.onExit}/>;
    }
  }

  const render=()=>{
    switch(page){
      case "home":        return <Home setPage={setPage} setGame={setGame}/>;
      case "about":       return <About/>;
      case "auth":        return <Auth onSuccess={()=>setPage("home")} auth={auth}/>;
      case "leaderboard": return <Leaderboard user={user}/>;
      default:            return <Home setPage={setPage} setGame={setGame}/>;
    }
  };

  return(<>
    <a href="#mc" style={{position:"fixed",top:-100,left:0,zIndex:9999,background:"var(--V)",color:"#fff",padding:".42rem .85rem",fontSize:".78rem",fontFamily:"Orbitron,monospace",transition:"top .2s"}}
      onFocus={e=>e.target.style.top="0"} onBlur={e=>e.target.style.top="-100px"}>
      Skip to content
    </a>
    <Navbar page={page} setPage={setPage} user={user} logout={auth.logout}/>
    <div id="mc">{render()}</div>
    <Footer setPage={setPage}/>
  </>);
}
