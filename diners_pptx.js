const pptxgen = require("pptxgenjs");

const OUT = "/Users/carolinaramirezvera/Documents/GammaVault/Diners_Estrategia_Digital_2026.pptx";

// ── Palette ────────────────────────────────────────────────────────────────
const C = {
  navy:     "1B2B4B",
  navyMid:  "243858",
  gold:     "B8922A",
  goldLight:"D4A843",
  white:    "FFFFFF",
  cream:    "F7F5F0",
  gray:     "6B7280",
  grayLight:"E5E7EB",
  red:      "C0392B",
  green:    "16A34A",
  orange:   "D97706",
  text:     "1B2B4B",
};

const makeShadow = () => ({ type:"outer", color:"000000", blur:8, offset:3, angle:45, opacity:0.10 });

const pres = new pptxgen();
pres.layout = "LAYOUT_16x9";
pres.title  = "Estrategia Digital Diners 2026";
pres.author = "Carolina Ramirez — Ediciones Gamma";

// ═══════════════════════════════════════════════════════════════════════════
// SLIDE 1 — PORTADA
// ═══════════════════════════════════════════════════════════════════════════
{
  const s = pres.addSlide();
  s.background = { color: C.navy };

  // Background accent rectangle top-right
  s.addShape(pres.shapes.RECTANGLE, { x:6.5, y:0, w:3.5, h:5.625, fill:{ color:C.navyMid }, line:{ color:C.navyMid } });

  // Gold horizontal rule
  s.addShape(pres.shapes.RECTANGLE, { x:0.55, y:2.65, w:2.0, h:0.05, fill:{ color:C.goldLight }, line:{ color:C.goldLight } });

  // Eyebrow
  s.addText("EDICIONES GAMMA  ·  REVISTA DINERS", {
    x:0.55, y:2.2, w:6, h:0.35,
    fontSize:9, fontFace:"Calibri", color:C.goldLight, bold:true, charSpacing:3, margin:0
  });

  // Title
  s.addText("Estrategia Digital", {
    x:0.55, y:2.8, w:6, h:0.75,
    fontSize:40, fontFace:"Cambria", color:C.white, bold:true, margin:0
  });
  s.addText("Diners 2026", {
    x:0.55, y:3.52, w:6, h:0.75,
    fontSize:40, fontFace:"Cambria", color:C.goldLight, bold:true, margin:0
  });

  // Subtitle
  s.addText("Pauta · RRSS · Newsletter · SEO · CRO · LLM", {
    x:0.55, y:4.4, w:6, h:0.4,
    fontSize:13, fontFace:"Calibri", color:"AABBD4", margin:0
  });

  // Right column labels
  const labels = [
    { label:"Elaborado por", val:"Carolina Ramirez" },
    { label:"Fecha",         val:"Junio 2026" },
    { label:"Versión",       val:"1.0" },
  ];
  labels.forEach((l, i) => {
    const yBase = 1.2 + i * 0.9;
    s.addText(l.label.toUpperCase(), { x:6.8, y:yBase, w:2.8, h:0.25, fontSize:8, fontFace:"Calibri", color:C.goldLight, bold:true, charSpacing:2, margin:0 });
    s.addText(l.val, { x:6.8, y:yBase+0.28, w:2.8, h:0.35, fontSize:13, fontFace:"Calibri", color:C.white, margin:0 });
  });

  // Footer
  s.addText("Confidencial — Uso interno Ediciones Gamma", {
    x:0.55, y:5.3, w:9, h:0.25,
    fontSize:8, fontFace:"Calibri", color:"4A6080", margin:0
  });
}

// ═══════════════════════════════════════════════════════════════════════════
// SLIDE 2 — EL DIAGNÓSTICO EN UNA LÍNEA
// ═══════════════════════════════════════════════════════════════════════════
{
  const s = pres.addSlide();
  s.background = { color: C.cream };

  // Section label
  s.addText("DIAGNÓSTICO CENTRAL", {
    x:0.5, y:0.22, w:9, h:0.3, fontSize:9, fontFace:"Calibri", color:C.goldLight, bold:true, charSpacing:3, margin:0
  });

  // Main headline
  s.addText("El problema no es el contenido.\nEs el funnel.", {
    x:0.5, y:0.6, w:9.0, h:1.35,
    fontSize:32, fontFace:"Cambria", color:C.navy, bold:true, margin:0
  });

  // Subhead
  s.addText("Pauta, Newsletter y Google Ads tienen la misma causa raíz: el checkout roto y el Pixel sin instalar.", {
    x:0.5, y:1.95, w:9, h:0.5,
    fontSize:14, fontFace:"Calibri", color:C.gray, margin:0
  });

  // 4 stat cards
  const stats = [
    { n:"47,971", label:"Clics de pauta",    sub:"→ 1 suscripción", color:C.red },
    { n:"55.1%",  label:"Open rate newsletter (11K lista activa)", sub:"→ COP $0 generados", color:C.orange },
    { n:"COP 0",  label:"Revenue en Google Ads", sub:"6 meses · COP 2.1M invertidos", color:C.red },
    { n:"1.4%",   label:"Páginas indexadas",  sub:"de 787K conocidas por Google", color:C.orange },
  ];

  stats.forEach((st, i) => {
    const x = 0.5 + i * 2.38;
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, {
      x, y:2.65, w:2.15, h:2.45,
      fill:{ color:C.white }, rectRadius:0.08, shadow:makeShadow(), line:{ color:C.grayLight }
    });
    s.addShape(pres.shapes.RECTANGLE, { x:x+0.18, y:2.7, w:1.79, h:0.07, fill:{ color:st.color }, line:{ color:st.color } });
    s.addText(st.n, {
      x, y:2.85, w:2.15, h:0.75,
      fontSize:28, fontFace:"Cambria", color:st.color, bold:true, align:"center", margin:0
    });
    s.addText(st.label, {
      x:x+0.1, y:3.62, w:1.95, h:0.5,
      fontSize:10, fontFace:"Calibri", color:C.navy, bold:true, align:"center", margin:0
    });
    s.addText(st.sub, {
      x:x+0.1, y:4.14, w:1.95, h:0.7,
      fontSize:9, fontFace:"Calibri", color:C.gray, align:"center", margin:0
    });
  });

  // Bottom note
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x:0.5, y:5.2, w:9, h:0.3, fill:{ color:"EEF2FF" }, line:{ color:"C7D2FE" }, rectRadius:0.05 });
  s.addText("Arreglar el funnel (Juan David · 5 tareas · semana del 23 jun) desbloquea simultáneamente todos los canales.", {
    x:0.65, y:5.22, w:8.7, h:0.26, fontSize:9.5, fontFace:"Calibri", color:C.navy, margin:0
  });
}

// ═══════════════════════════════════════════════════════════════════════════
// SLIDE 3 — 4 ÁREAS ESTRATÉGICAS
// ═══════════════════════════════════════════════════════════════════════════
{
  const s = pres.addSlide();
  s.background = { color: C.navy };

  s.addText("PLAN ESTRATÉGICO", {
    x:0.5, y:0.22, w:9, h:0.3, fontSize:9, fontFace:"Calibri", color:C.goldLight, bold:true, charSpacing:3, margin:0
  });
  s.addText("4 áreas · 1 objetivo: convertir lectores en suscriptores", {
    x:0.5, y:0.58, w:9, h:0.55,
    fontSize:26, fontFace:"Cambria", color:C.white, bold:true, margin:0
  });

  const areas = [
    {
      num:"01", title:"Pauta Digital",
      items:["Track 1 Consideración — $520K/sem", "Track 2 Conversión — $780K/sem", "Meta Ads + Google Ads Captación", "Budget total: $1.3M COP/semana"],
      color:C.goldLight
    },
    {
      num:"02", title:"RRSS",
      items:["7 ejes E-E-A-T por plataforma", "IG · FB · TikTok · Pinterest · YouTube", "Calendario editorial semanal", "Objetivo: tráfico + suscripciones"],
      color:"5B9BD5"
    },
    {
      num:"03", title:"Newsletter HubSpot",
      items:["Lista 22K → segmentar 4 grupos", "Workflows Bienvenida + Conversión", "Activar UTMs (hoy Revenue = COP 0)", "OR activos: 55.1%"],
      color:"70AD47"
    },
    {
      num:"04", title:"SEO · CRO · LLM",
      items:["+7K clics/trim sin contenido nuevo", "llms.txt + Schema Author + AI briefs", "Fix LCP · 404s · crawl budget", "CTR 1.65% → 3% objetivo"],
      color:"ED7D31"
    },
  ];

  areas.forEach((a, i) => {
    const x = 0.45 + i * 2.33;
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, {
      x, y:1.35, w:2.1, h:3.95,
      fill:{ color:C.navyMid }, rectRadius:0.1, line:{ color:a.color }
    });
    // Number
    s.addText(a.num, {
      x, y:1.45, w:2.1, h:0.55,
      fontSize:22, fontFace:"Cambria", color:a.color, bold:true, align:"center", margin:0
    });
    // Title
    s.addText(a.title, {
      x:x+0.1, y:2.0, w:1.9, h:0.45,
      fontSize:12.5, fontFace:"Calibri", color:C.white, bold:true, align:"center", margin:0
    });
    // Divider
    s.addShape(pres.shapes.RECTANGLE, { x:x+0.4, y:2.5, w:1.3, h:0.03, fill:{ color:a.color }, line:{ color:a.color } });
    // Items
    s.addText(a.items.map(item => ({ text:item, options:{ bullet:true, breakLine:true, paraSpaceAfter:3 } })), {
      x:x+0.15, y:2.6, w:1.85, h:2.55,
      fontSize:9.5, fontFace:"Calibri", color:"CADCEF", margin:0
    });
  });

  // Bottom tag
  s.addText("Todas las áreas convergen en un único cuello de botella: funnel de compra · Owner: Juan David", {
    x:0.5, y:5.32, w:9, h:0.22, fontSize:8.5, fontFace:"Calibri", color:"6A8CAA", align:"center", margin:0
  });
}

// ═══════════════════════════════════════════════════════════════════════════
// SLIDE 4 — EQUIPO Y RESPONSABILIDADES
// ═══════════════════════════════════════════════════════════════════════════
{
  const s = pres.addSlide();
  s.background = { color: C.cream };

  s.addText("EQUIPO", {
    x:0.5, y:0.22, w:9, h:0.3, fontSize:9, fontFace:"Calibri", color:C.goldLight, bold:true, charSpacing:3, margin:0
  });
  s.addText("Quién hace qué — sin ambigüedad", {
    x:0.5, y:0.58, w:9, h:0.5,
    fontSize:26, fontFace:"Cambria", color:C.navy, bold:true, margin:0
  });

  const people = [
    {
      name:"Juan David",
      role:"WordPress · Técnico",
      color:"1E40AF",
      bgColor:"EFF6FF",
      tasks:["Redirect 301 /suscripciones/", "Arreglar checkout WooCommerce", "Instalar Meta Pixel (4 eventos)", "Conversion tracking Google Ads", "Fixes técnicos SEO (404, noindex, LCP)", "llms.txt + Schema Organization/Author"],
    },
    {
      name:"Paola Gordillo",
      role:"HubSpot · RRSS Diners",
      color:"065F46",
      bgColor:"ECFDF5",
      tasks:["Segmentar lista 4 grupos (P0)", "Activar UTMs en HubSpot (P0)", "Workflows Bienvenida + Conversión", "Template newsletter + pop-up", "Actualizar perfiles RRSS críticos", "Calendario de contenidos RRSS"],
    },
    {
      name:"Simon Granja",
      role:"Copy · Contenido editorial",
      color:"7C3AED",
      bgColor:"F5F3FF",
      tasks:["Reescribir title/meta 3 artículos clave", "Copy landing suscripciones", "Tabla comparativa planes (precios)", "Bloque respuesta directa IA top arts", "Linkear clusters gastronomía/series", "Brief editorial para Paola"],
    },
    {
      name:"Sebastián Díaz",
      role:"Meta Ads · Google Ads",
      color:"C2410C",
      bgColor:"FFF7ED",
      tasks:["Lanzar Track 1 Consideración (P1)", "Lanzar Track 2 Conversión (P1)", "Campaña captación Google Ads", "Optimizar segmentación audiencias", "Dayparting Sáb-Dom 9am-1pm", "Reportes semanales ROAS"],
    },
    {
      name:"Carolina",
      role:"Decisiones · Aprobaciones",
      color:"9D174D",
      bgColor:"FDF2F8",
      tasks:["Decidir precio plan 6 meses", "Solicitar baseline RRSS", "Acceso GA4 + GSC", "Definir MVP Carnet Digital", "Aprobar creativos pauta", "Pipeline 5 nuevos anunciantes H2"],
    },
  ];

  people.forEach((p, i) => {
    const col = i < 3 ? i : i - 3;
    const row = i < 3 ? 0 : 1;
    const colW = i < 3 ? 3.0 : 3.0;
    const x = i < 3 ? 0.35 + col * 3.15 : 1.85 + col * 3.15;
    const y = 1.3 + row * 2.2;
    const h = 1.85;

    s.addShape(pres.shapes.ROUNDED_RECTANGLE, {
      x, y, w:2.9, h,
      fill:{ color:p.bgColor }, rectRadius:0.08, shadow:makeShadow(), line:{ color:C.grayLight }
    });
    s.addText(p.name, {
      x:x+0.15, y:y+0.12, w:2.6, h:0.3,
      fontSize:12, fontFace:"Calibri", color:p.color, bold:true, margin:0
    });
    s.addText(p.role, {
      x:x+0.15, y:y+0.42, w:2.6, h:0.22,
      fontSize:8.5, fontFace:"Calibri", color:C.gray, margin:0
    });
    s.addShape(pres.shapes.RECTANGLE, { x:x+0.15, y:y+0.66, w:2.6, h:0.03, fill:{ color:p.color }, line:{ color:p.color } });
    // Top 3 tasks only
    const top3 = p.tasks.slice(0,3);
    s.addText(top3.map(t => ({ text:t, options:{ bullet:true, breakLine:true, paraSpaceAfter:2 } })), {
      x:x+0.15, y:y+0.75, w:2.7, h:1.0,
      fontSize:8.5, fontFace:"Calibri", color:C.text, margin:0
    });
  });
}

// ═══════════════════════════════════════════════════════════════════════════
// SLIDE 5 — P0: LAS TAREAS BLOQUEANTES
// ═══════════════════════════════════════════════════════════════════════════
{
  const s = pres.addSlide();
  s.background = { color: C.cream };

  s.addText("PRIORIDAD 0 — ESTA SEMANA", {
    x:0.5, y:0.22, w:9, h:0.3, fontSize:9, fontFace:"Calibri", color:C.red, bold:true, charSpacing:3, margin:0
  });
  s.addText("Bloqueantes de todos los canales · Semana del 23 jun", {
    x:0.5, y:0.58, w:9, h:0.5,
    fontSize:24, fontFace:"Cambria", color:C.navy, bold:true, margin:0
  });

  // Two columns of tasks
  const col1 = [
    { id:"0A", task:"Redirect 301 /suscripciones/ → URL canónica",   owner:"Juan David", urg:"CRÍTICO" },
    { id:"0B", task:"Arreglar checkout WooCommerce end-to-end",       owner:"Juan David", urg:"CRÍTICO" },
    { id:"0C", task:"Instalar Meta Pixel con 4 eventos",              owner:"Juan David", urg:"CRÍTICO" },
    { id:"0D", task:"Configurar conversion tracking Google Ads",      owner:"Juan David + Sebastián", urg:"CRÍTICO" },
    { id:"0E", task:"Unificar 2 URLs suscripciones en 1",             owner:"Juan David", urg:"ESTA SEMANA" },
    { id:"0F", task:"Segmentar lista newsletter (4 grupos en HubSpot)", owner:"Paola Gordillo", urg:"CRÍTICO" },
    { id:"0G", task:"Activar UTMs en HubSpot Email",                  owner:"Paola Gordillo", urg:"ESTA SEMANA" },
  ];
  const col2 = [
    { id:"0H", task:"Reescribir title + meta 'Canciones indirectas'", owner:"Simon Granja", urg:"ESTA SEMANA" },
    { id:"0I", task:"Reescribir title + meta 'Santorini colombiano'", owner:"Simon Granja", urg:"ESTA SEMANA" },
    { id:"0J", task:"Fix homepage meta: 'Revista Diners Colombia'",   owner:"Simon Granja", urg:"ESTA SEMANA" },
    { id:"0K", task:"Bloquear URLs paramétricas en robots.txt",       owner:"Juan David", urg:"ESTA SEMANA" },
    { id:"0L", task:"noindex en URLs /uncategorized/",                owner:"Juan David", urg:"ESTA SEMANA" },
    { id:"0M", task:"noindex en paginación > page/2",                 owner:"Juan David", urg:"ESTA SEMANA" },
  ];

  const urgColor = (u) => u === "CRÍTICO" ? C.red : C.orange;

  [[col1, 0.4], [col2, 5.1]].forEach(([col, xStart]) => {
    col.forEach((t, i) => {
      const y = 1.3 + i * 0.59;
      s.addShape(pres.shapes.ROUNDED_RECTANGLE, {
        x:xStart, y, w:4.5, h:0.52,
        fill:{ color:C.white }, rectRadius:0.06, shadow:makeShadow(), line:{ color:C.grayLight }
      });
      // ID badge
      s.addShape(pres.shapes.ROUNDED_RECTANGLE, {
        x:xStart+0.1, y:y+0.1, w:0.38, h:0.32,
        fill:{ color:urgColor(t.urg) }, rectRadius:0.04, line:{ color:urgColor(t.urg) }
      });
      s.addText(t.id, { x:xStart+0.1, y:y+0.1, w:0.38, h:0.32, fontSize:8, fontFace:"Calibri", color:C.white, bold:true, align:"center", valign:"middle", margin:0 });
      // Task
      s.addText(t.task, { x:xStart+0.55, y:y+0.04, w:3.05, h:0.28, fontSize:9.5, fontFace:"Calibri", color:C.navy, bold:true, margin:0 });
      // Owner
      s.addText(t.owner, { x:xStart+0.55, y:y+0.3, w:3.05, h:0.18, fontSize:8, fontFace:"Calibri", color:C.gray, margin:0 });
      // Urgency
      const urgText = t.urg === "CRÍTICO" ? "CRÍTICO" : "ESTA SEM.";
      s.addText(urgText, { x:xStart+3.65, y:y+0.15, w:0.78, h:0.22, fontSize:7, fontFace:"Calibri", color:urgColor(t.urg), bold:true, align:"center", margin:0 });
    });
  });
}

// ═══════════════════════════════════════════════════════════════════════════
// SLIDE 6 — PAUTA DIGITAL (FASE 1)
// ═══════════════════════════════════════════════════════════════════════════
{
  const s = pres.addSlide();
  s.background = { color: C.navy };

  s.addText("ÁREA 01 — PAUTA DIGITAL", {
    x:0.5, y:0.22, w:9, h:0.3, fontSize:9, fontFace:"Calibri", color:C.goldLight, bold:true, charSpacing:3, margin:0
  });
  s.addText("Fase 1 · Meta Ads · Jun 28 – Jul 11", {
    x:0.5, y:0.58, w:9, h:0.5,
    fontSize:24, fontFace:"Cambria", color:C.white, bold:true, margin:0
  });

  // Track 1
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x:0.4, y:1.25, w:4.4, h:3.85, fill:{ color:C.navyMid }, rectRadius:0.1, line:{ color:"5B9BD5" } });
  s.addText("TRACK 1 · CONSIDERACIÓN", { x:0.55, y:1.38, w:4.1, h:0.3, fontSize:10, fontFace:"Calibri", color:"5B9BD5", bold:true, charSpacing:1, margin:0 });
  s.addText("$520,000 COP / semana", { x:0.55, y:1.7, w:4.1, h:0.42, fontSize:22, fontFace:"Cambria", color:C.white, bold:true, margin:0 });
  s.addShape(pres.shapes.RECTANGLE, { x:0.55, y:2.15, w:4.1, h:0.03, fill:{ color:"5B9BD5" }, line:{ color:"5B9BD5" } });

  const t1 = ["Objetivo: Tráfico · Alcance · Reconocimiento", "Audiencias: Intereses cultura/gastronomía/viajes", "Formatos: Carrusel editorial + Reels top artículos", "Meta: CTR >2% · CPC <$120 COP · 2.5M impresiones/mes", "Prerequisito: Pixel instalado (Juan David)"];
  s.addText(t1.map(i => ({ text:i, options:{ bullet:true, breakLine:true, paraSpaceAfter:6 } })), {
    x:0.55, y:2.28, w:4.15, h:2.6, fontSize:9.5, fontFace:"Calibri", color:"CADCEF", margin:0
  });

  // Track 2
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x:5.2, y:1.25, w:4.4, h:3.85, fill:{ color:C.navyMid }, rectRadius:0.1, line:{ color:C.goldLight } });
  s.addText("TRACK 2 · CONVERSIÓN", { x:5.35, y:1.38, w:4.1, h:0.3, fontSize:10, fontFace:"Calibri", color:C.goldLight, bold:true, charSpacing:1, margin:0 });
  s.addText("$780,000 COP / semana", { x:5.35, y:1.7, w:4.1, h:0.42, fontSize:22, fontFace:"Cambria", color:C.white, bold:true, margin:0 });
  s.addShape(pres.shapes.RECTANGLE, { x:5.35, y:2.15, w:4.1, h:0.03, fill:{ color:C.goldLight }, line:{ color:C.goldLight } });

  const t2 = ["Objetivo: Ventas (Purchase event)", "Audiencias: Retargeting + Lookalike suscriptores", "Formatos: Creative con tabla comparativa planes", "Meta: CVR >2% · CPA <$35,000 COP · 50 sus/mes", "Prerequisito: Checkout reparado (Juan David)"];
  s.addText(t2.map(i => ({ text:i, options:{ bullet:true, breakLine:true, paraSpaceAfter:6 } })), {
    x:5.35, y:2.28, w:4.15, h:2.6, fontSize:9.5, fontFace:"Calibri", color:"CADCEF", margin:0
  });

  // Bottom total
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x:0.4, y:5.2, w:9.2, h:0.3, fill:{ color:"243858" }, rectRadius:0.06, line:{ color:C.goldLight } });
  s.addText("Budget total Fase 1: $1,300,000 COP / semana  ·  Rolex y clientes externos: EXCLUIDOS (son ingresos por servicio)", {
    x:0.5, y:5.22, w:9, h:0.26, fontSize:9, fontFace:"Calibri", color:C.goldLight, align:"center", margin:0
  });
}

// ═══════════════════════════════════════════════════════════════════════════
// SLIDE 7 — NEWSLETTER HUBSPOT
// ═══════════════════════════════════════════════════════════════════════════
{
  const s = pres.addSlide();
  s.background = { color: C.cream };

  s.addText("ÁREA 03 — NEWSLETTER HUBSPOT", {
    x:0.5, y:0.22, w:9, h:0.3, fontSize:9, fontFace:"Calibri", color:C.goldLight, bold:true, charSpacing:3, margin:0
  });
  s.addText("Datos reales · Diagnóstico · Plan de acción", {
    x:0.5, y:0.58, w:9, h:0.5,
    fontSize:24, fontFace:"Cambria", color:C.navy, bold:true, margin:0
  });

  // Data cards — real HubSpot data
  const dataCards = [
    { label:"Lista total", val:"22,362", sub:"contactos entregables", color:"1E40AF" },
    { label:"OR segmento activo\n(11K · Jun 14)", val:"55.1%", sub:"mejor que promedio cuenta", color:C.green },
    { label:"OR full list\n(22K · Jun 19)", val:"21.86%", sub:"arrastra inactivos", color:C.orange },
    { label:"Conversiones", val:"COP $0", sub:"funnel destino roto", color:C.red },
  ];

  dataCards.forEach((c, i) => {
    const x = 0.4 + i * 2.35;
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, {
      x, y:1.25, w:2.1, h:1.6,
      fill:{ color:C.white }, rectRadius:0.08, shadow:makeShadow(), line:{ color:C.grayLight }
    });
    s.addText(c.val, { x, y:1.38, w:2.1, h:0.65, fontSize:26, fontFace:"Cambria", color:c.color, bold:true, align:"center", margin:0 });
    s.addText(c.label, { x:x+0.08, y:2.06, w:1.95, h:0.4, fontSize:8.5, fontFace:"Calibri", color:C.navy, bold:true, align:"center", margin:0 });
    s.addText(c.sub, { x:x+0.08, y:2.46, w:1.95, h:0.28, fontSize:8, fontFace:"Calibri", color:C.gray, align:"center", margin:0 });
  });

  // 3 immediate actions
  const actions = [
    {
      num:"1", title:"Segmentar lista — HOY",
      desc:"Crear 4 listas en HubSpot: Activos (abrieron 30d) · Tibios · Inactivos · Suscriptores pago.\nNunca más enviar a los 22K sin separar.",
      owner:"Paola Gordillo", color:"1E40AF"
    },
    {
      num:"2", title:"Activar UTMs — HOY",
      desc:"HubSpot Settings → Email → Tracking → UTM parameters.\nSin esto el tráfico de email aparece como 'directo' en GA4 y Revenue = COP $0.",
      owner:"Paola Gordillo", color:"065F46"
    },
    {
      num:"3", title:"Workflows (semana del 30 jun)",
      desc:"Bienvenida (3 emails: inmediato · día 3 · día 7) +\nConversión (3 emails a lista Tibios). Solo lanzar cuando checkout esté reparado.",
      owner:"Paola Gordillo", color:"7C3AED"
    },
  ];

  actions.forEach((a, i) => {
    const x = 0.4 + i * 3.15;
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, {
      x, y:3.05, w:2.9, h:2.2,
      fill:{ color:C.white }, rectRadius:0.08, shadow:makeShadow(), line:{ color:C.grayLight }
    });
    s.addShape(pres.shapes.OVAL, { x:x+0.15, y:3.12, w:0.42, h:0.42, fill:{ color:a.color }, line:{ color:a.color } });
    s.addText(a.num, { x:x+0.15, y:3.12, w:0.42, h:0.42, fontSize:12, fontFace:"Calibri", color:C.white, bold:true, align:"center", valign:"middle", margin:0 });
    s.addText(a.title, { x:x+0.65, y:3.15, w:2.1, h:0.38, fontSize:10.5, fontFace:"Calibri", color:a.color, bold:true, margin:0 });
    s.addText(a.desc, { x:x+0.15, y:3.62, w:2.65, h:1.18, fontSize:8.5, fontFace:"Calibri", color:C.text, margin:0 });
    s.addText("→ " + a.owner, { x:x+0.15, y:4.88, w:2.65, h:0.22, fontSize:8, fontFace:"Calibri", color:a.color, bold:true, margin:0 });
  });
}

// ═══════════════════════════════════════════════════════════════════════════
// SLIDE 8 — SEO · CRO · LLM
// ═══════════════════════════════════════════════════════════════════════════
{
  const s = pres.addSlide();
  s.background = { color: C.cream };

  s.addText("ÁREA 04 — SEO · CRO · LLM", {
    x:0.5, y:0.22, w:9, h:0.3, fontSize:9, fontFace:"Calibri", color:C.goldLight, bold:true, charSpacing:3, margin:0
  });
  s.addText("Más tráfico, mejor tráfico, visible en IA", {
    x:0.5, y:0.58, w:9, h:0.5,
    fontSize:24, fontFace:"Cambria", color:C.navy, bold:true, margin:0
  });

  // Left column: SEO quick wins
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x:0.4, y:1.2, w:4.3, h:4.05, fill:{ color:C.white }, rectRadius:0.08, shadow:makeShadow(), line:{ color:C.grayLight } });
  s.addText("SEO — Quick Wins (sin contenido nuevo)", { x:0.6, y:1.32, w:3.9, h:0.3, fontSize:10.5, fontFace:"Calibri", color:C.navy, bold:true, margin:0 });
  s.addShape(pres.shapes.RECTANGLE, { x:0.6, y:1.65, w:3.9, h:0.03, fill:{ color:C.grayLight }, line:{ color:C.grayLight } });

  const seoItems = [
    { page:'"Canciones indirectas"', stat:"95K imp · CTR 0.7%", action:"Reescribir title + meta", gain:"+4,000 clics/trim" },
    { page:'"Santorini colombiano"', stat:"29K imp · CTR 0.17%", action:"Fix intent mismatch", gain:"+2,500 clics/trim" },
    { page:'"Brunch Bogotá 2026"',   stat:"66K imp · CTR 1.86%", action:"Update + internal links", gain:"+3,500 clics/trim" },
  ];
  seoItems.forEach((item, i) => {
    const y = 1.78 + i * 0.95;
    s.addText(item.page, { x:0.65, y, w:3.8, h:0.28, fontSize:10, fontFace:"Calibri", color:C.navy, bold:true, margin:0 });
    s.addText(item.stat, { x:0.65, y:y+0.28, w:3.8, h:0.22, fontSize:8.5, fontFace:"Calibri", color:C.gray, margin:0 });
    s.addText("→ " + item.action, { x:0.65, y:y+0.5, w:2.4, h:0.2, fontSize:8.5, fontFace:"Calibri", color:C.text, margin:0 });
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x:3.1, y:y+0.46, w:1.4, h:0.24, fill:{ color:"D1FAE5" }, rectRadius:0.04, line:{ color:"6EE7B7" } });
    s.addText(item.gain, { x:3.1, y:y+0.46, w:1.4, h:0.24, fontSize:7.5, fontFace:"Calibri", color:"065F46", bold:true, align:"center", margin:0 });
  });

  s.addShape(pres.shapes.RECTANGLE, { x:0.6, y:4.62, w:3.9, h:0.03, fill:{ color:C.grayLight }, line:{ color:C.grayLight } });
  s.addText("Total estimado Sprint 1: +7,000 – 10,000 clics/trimestre sin un solo artículo nuevo", {
    x:0.6, y:4.68, w:3.9, h:0.38, fontSize:8.5, fontFace:"Calibri", color:C.green, bold:true, margin:0
  });

  // Right column: LLM + CRO
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x:5.0, y:1.2, w:4.6, h:1.9, fill:{ color:C.white }, rectRadius:0.08, shadow:makeShadow(), line:{ color:C.grayLight } });
  s.addText("LLM / AI Search — Canal emergente", { x:5.2, y:1.32, w:4.2, h:0.3, fontSize:10.5, fontFace:"Calibri", color:C.navy, bold:true, margin:0 });
  s.addShape(pres.shapes.RECTANGLE, { x:5.2, y:1.65, w:4.2, h:0.03, fill:{ color:C.grayLight }, line:{ color:C.grayLight } });
  s.addText("Diners ya tiene 62 sesiones/año via AI assistants sin optimización.\nCon llms.txt + Schema Author + bloques de respuesta directa en top artículos,\nel contenido existente se vuelve citable en Google AI Overviews, ChatGPT y Perplexity.", {
    x:5.2, y:1.72, w:4.2, h:1.1, fontSize:9, fontFace:"Calibri", color:C.text, margin:0
  });
  const llmTasks = ["Crear /llms.txt (Juan David · P2)", "Schema Organization + Article + Author (Juan David · P2)", "Bloque 'En resumen' top 3 artículos (Simon Granja · P2)"];
  s.addText(llmTasks.map(t => ({ text:t, options:{ bullet:true, breakLine:true, paraSpaceAfter:2 } })), {
    x:5.2, y:2.82, w:4.2, h:0.6, fontSize:8.5, fontFace:"Calibri", color:C.text, margin:0
  });

  // CRO card
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x:5.0, y:3.25, w:4.6, h:2.0, fill:{ color:C.white }, rectRadius:0.08, shadow:makeShadow(), line:{ color:C.grayLight } });
  s.addText("CRO — Landing Suscripciones", { x:5.2, y:3.37, w:4.2, h:0.3, fontSize:10.5, fontFace:"Calibri", color:C.navy, bold:true, margin:0 });
  s.addShape(pres.shapes.RECTANGLE, { x:5.2, y:3.7, w:4.2, h:0.03, fill:{ color:C.grayLight }, line:{ color:C.grayLight } });

  const croRows = [
    { label:"URL",       bad:"404 /suscripciones/",          fix:"Redirect → URL canónica (JD)" },
    { label:"Tabla",     bad:"Sin comparativa precio/mes",   fix:"Simon escribe · JD sube" },
    { label:"Social proof", bad:"Sin testimonios ni # suscriptores", fix:"Simon · copy + datos" },
    { label:"Hotjar",    bad:"0 datos de comportamiento",    fix:"JD instala · P2" },
  ];
  croRows.forEach((r, i) => {
    const y = 3.82 + i * 0.3;
    s.addText(r.label + ":", { x:5.2, y, w:0.75, h:0.26, fontSize:8.5, fontFace:"Calibri", color:C.navy, bold:true, margin:0 });
    s.addText(r.bad,  { x:5.97, y, w:1.55, h:0.26, fontSize:8, fontFace:"Calibri", color:C.red, margin:0 });
    s.addText("→ " + r.fix, { x:7.54, y, w:2.0, h:0.26, fontSize:8, fontFace:"Calibri", color:C.green, margin:0 });
  });
}

// ═══════════════════════════════════════════════════════════════════════════
// SLIDE 9 — CRONOGRAMA
// ═══════════════════════════════════════════════════════════════════════════
{
  const s = pres.addSlide();
  s.background = { color: C.navy };

  s.addText("CRONOGRAMA", {
    x:0.5, y:0.22, w:9, h:0.3, fontSize:9, fontFace:"Calibri", color:C.goldLight, bold:true, charSpacing:3, margin:0
  });
  s.addText("De la estrategia a la ejecución", {
    x:0.5, y:0.58, w:9, h:0.5,
    fontSize:24, fontFace:"Cambria", color:C.white, bold:true, margin:0
  });

  const phases = [
    {
      label:"P0", period:"23 – 28 Jun", color:C.red,
      title:"Funnel + Newsletter urgente",
      items:["Fix checkout · Pixel · Redirects (Juan David)", "Segmentar lista HubSpot · UTMs (Paola)", "3 quick wins SEO title/meta (Simon)"]
    },
    {
      label:"P1", period:"28 Jun – 5 Jul", color:C.orange,
      title:"Activar canales",
      items:["Lanzar Track 1 + Track 2 Meta Ads (Sebastián)", "Campaña Google Ads captación", "Decidir precio plan 6 meses (Carolina)"]
    },
    {
      label:"P2", period:"5 – 15 Jul", color:C.goldLight,
      title:"Optimización",
      items:["Landing suscripciones rediseñada", "Workflows HubSpot · template newsletter", "llms.txt · Schema · perfiles RRSS · Hotjar"]
    },
    {
      label:"P3", period:"Ago – Sep", color:"70AD47",
      title:"Escalar",
      items:["Primer newsletter segmentado con sponsor", "Lanzar TikTok · YouTube · Podcast", "Carnet Digital MVP público"]
    },
  ];

  phases.forEach((p, i) => {
    const x = 0.38 + i * 2.38;
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, {
      x, y:1.28, w:2.15, h:3.95,
      fill:{ color:C.navyMid }, rectRadius:0.1, line:{ color:p.color }
    });
    // Label badge
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, {
      x:x+0.6, y:1.36, w:0.95, h:0.38,
      fill:{ color:p.color }, rectRadius:0.06, line:{ color:p.color }
    });
    s.addText(p.label, { x:x+0.6, y:1.36, w:0.95, h:0.38, fontSize:14, fontFace:"Cambria", color:C.navy, bold:true, align:"center", valign:"middle", margin:0 });
    s.addText(p.period, { x:x+0.07, y:1.8, w:2.0, h:0.28, fontSize:9, fontFace:"Calibri", color:C.goldLight, align:"center", margin:0 });
    s.addText(p.title, { x:x+0.07, y:2.12, w:2.0, h:0.42, fontSize:10, fontFace:"Calibri", color:C.white, bold:true, align:"center", margin:0 });
    s.addShape(pres.shapes.RECTANGLE, { x:x+0.25, y:2.58, w:1.65, h:0.03, fill:{ color:p.color }, line:{ color:p.color } });
    s.addText(p.items.map(it => ({ text:it, options:{ bullet:true, breakLine:true, paraSpaceAfter:8 } })), {
      x:x+0.12, y:2.68, w:1.93, h:2.4, fontSize:8.5, fontFace:"Calibri", color:"CADCEF", margin:0
    });
  });

  // Dependency note
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x:0.38, y:5.22, w:9.22, h:0.28, fill:{ color:"1A3A6B" }, rectRadius:0.05, line:{ color:"5B9BD5" } });
  s.addText("P1 y P2 dependen de P0: nada en pauta ni newsletter convierte si el checkout está roto", {
    x:0.5, y:5.24, w:9, h:0.24, fontSize:9, fontFace:"Calibri", color:"CADCEF", align:"center", margin:0
  });
}

// ═══════════════════════════════════════════════════════════════════════════
// SLIDE 10 — MODELO PREDICTIVO
// ═══════════════════════════════════════════════════════════════════════════
{
  const s = pres.addSlide();
  s.background = { color: C.cream };

  s.addText("MODELO PREDICTIVO", {
    x:0.5, y:0.22, w:9, h:0.3, fontSize:9, fontFace:"Calibri", color:C.goldLight, bold:true, charSpacing:3, margin:0
  });
  s.addText("¿Qué pasa si no actuamos? ¿Qué logramos si ejecutamos?", {
    x:0.5, y:0.58, w:9, h:0.5,
    fontSize:22, fontFace:"Cambria", color:C.navy, bold:true, margin:0
  });

  const scenarios = [
    {
      label:"A — Sin cambios",
      color:C.red, bgColor:"FEF2F2",
      revenue:"$240 – $260M", gap:"Gap $70-90M sin resolver",
      bullets:["0 suscripciones digitales nuevas", "Tráfico baja a 120K pág/mes Q4", "Dependencia KEVINS crece", "Ningún canal nuevo lanzado"]
    },
    {
      label:"B — Con P0+P1+P2",
      color:C.orange, bgColor:"FFFBEB",
      revenue:"$290 – $310M", gap:"Gap $20-40M recuperable",
      bullets:["Newsletter: 5K suscriptores, ROAS >4x", "Tráfico orgánico +50% vs base", "TikTok lanzado · Carnet Digital MVP", "5+ nuevos anunciantes digitales"]
    },
    {
      label:"C — Ejecución perfecta",
      color:C.green, bgColor:"F0FDF4",
      revenue:"$329M", gap:"100% del presupuesto anual",
      bullets:["Newsletter: 10K sus · $4M COP/mes", "TikTok: 50K+ followers", "Podcast: 3K listens/episodio c/sponsor", "Carnet Digital: 5K carnets activos"]
    },
  ];

  scenarios.forEach((sc, i) => {
    const x = 0.35 + i * 3.15;
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, {
      x, y:1.25, w:2.95, h:3.95,
      fill:{ color:sc.bgColor }, rectRadius:0.1, shadow:makeShadow(), line:{ color:sc.color }
    });
    s.addText(sc.label, { x:x+0.12, y:1.35, w:2.7, h:0.38, fontSize:11, fontFace:"Calibri", color:sc.color, bold:true, margin:0 });
    s.addText(sc.revenue, { x:x+0.12, y:1.75, w:2.7, h:0.52, fontSize:22, fontFace:"Cambria", color:C.navy, bold:true, margin:0 });
    s.addText(sc.gap, { x:x+0.12, y:2.28, w:2.7, h:0.3, fontSize:9, fontFace:"Calibri", color:sc.color, margin:0 });
    s.addShape(pres.shapes.RECTANGLE, { x:x+0.12, y:2.62, w:2.7, h:0.03, fill:{ color:sc.color }, line:{ color:sc.color } });
    s.addText(sc.bullets.map(b => ({ text:b, options:{ bullet:true, breakLine:true, paraSpaceAfter:5 } })), {
      x:x+0.12, y:2.72, w:2.78, h:2.35, fontSize:9, fontFace:"Calibri", color:C.text, margin:0
    });
  });

  // Bottom insight
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x:0.35, y:5.22, w:9.3, h:0.3, fill:{ color:C.navy }, rectRadius:0.06, line:{ color:C.navy } });
  s.addText("El escenario B es alcanzable con los recursos actuales si el funnel se arregla antes del 28 jun.", {
    x:0.5, y:5.24, w:9.1, h:0.26, fontSize:9.5, fontFace:"Calibri", color:C.goldLight, align:"center", margin:0
  });
}

// ═══════════════════════════════════════════════════════════════════════════
// SLIDE 11 — CIERRE
// ═══════════════════════════════════════════════════════════════════════════
{
  const s = pres.addSlide();
  s.background = { color: C.navy };

  // Accent block
  s.addShape(pres.shapes.RECTANGLE, { x:0, y:0, w:4.0, h:5.625, fill:{ color:C.navyMid }, line:{ color:C.navyMid } });

  // Left: next step
  s.addText("PRÓXIMO PASO", { x:0.4, y:0.9, w:3.2, h:0.35, fontSize:9, fontFace:"Calibri", color:C.goldLight, bold:true, charSpacing:3, margin:0 });
  s.addText("Esta semana", { x:0.4, y:1.32, w:3.2, h:0.55, fontSize:28, fontFace:"Cambria", color:C.white, bold:true, margin:0 });
  s.addShape(pres.shapes.RECTANGLE, { x:0.4, y:1.92, w:2.8, h:0.05, fill:{ color:C.goldLight }, line:{ color:C.goldLight } });

  const nextSteps = [
    "Juan David: redirect + checkout + Pixel",
    "Paola: segmentar lista + activar UTMs",
    "Simon: 3 titles/metas + fix homepage",
    "Carolina: confirmar precio plan 6 meses",
  ];
  s.addText(nextSteps.map(n => ({ text:n, options:{ bullet:true, breakLine:true, paraSpaceAfter:10 } })), {
    x:0.4, y:2.05, w:3.3, h:2.5, fontSize:10.5, fontFace:"Calibri", color:C.white, margin:0
  });

  s.addText("Plazo máximo: 28 junio 2026", {
    x:0.4, y:4.65, w:3.2, h:0.35, fontSize:9.5, fontFace:"Calibri", color:C.goldLight, bold:true, margin:0
  });

  // Right: summary stats
  s.addText("Estrategia Digital Diners", { x:4.3, y:0.9, w:5.3, h:0.45, fontSize:22, fontFace:"Cambria", color:C.white, bold:true, margin:0 });
  s.addText("Resumen de entregables de esta sesión", { x:4.3, y:1.4, w:5.3, h:0.3, fontSize:11, fontFace:"Calibri", color:"AABBD4", margin:0 });
  s.addShape(pres.shapes.RECTANGLE, { x:4.3, y:1.77, w:5.3, h:0.04, fill:{ color:C.goldLight }, line:{ color:C.goldLight } });

  const deliverables = [
    { label:"Pauta Fase 1",   val:"Plan completo Meta Ads — Diners_05_PautaDigital_2026-06.xlsx" },
    { label:"RRSS",           val:"Auditoría + ejes E-E-A-T + plan acción — Diners_RRSS_2026-06.xlsx" },
    { label:"Newsletter",     val:"Estrategia + análisis datos HubSpot — Diners_Newsletter_2026-06.xlsx" },
    { label:"SEO",            val:"GSC audit + 3 sprints + clusters + 13 P0 técnicos" },
    { label:"CRO",            val:"Audit landing suscripciones · fix funnel" },
    { label:"LLM/AI Search",  val:"llms.txt + Schema Author + AI briefs top artículos" },
    { label:"Next Steps",     val:"29 tareas consolidadas en Diners.md (P0→P3)" },
  ];

  deliverables.forEach((d, i) => {
    const y = 1.95 + i * 0.46;
    s.addText(d.label + ":", { x:4.3, y, w:1.2, h:0.38, fontSize:9, fontFace:"Calibri", color:C.goldLight, bold:true, margin:0 });
    s.addText(d.val, { x:5.55, y, w:3.95, h:0.38, fontSize:9, fontFace:"Calibri", color:"CADCEF", margin:0 });
  });

  s.addText("Ediciones Gamma · Revista Diners · Junio 2026", {
    x:4.3, y:5.28, w:5.3, h:0.25, fontSize:8, fontFace:"Calibri", color:"4A6080", margin:0
  });
}

// ── Write file ─────────────────────────────────────────────────────────────
pres.writeFile({ fileName: OUT })
  .then(() => console.log("OK: " + OUT))
  .catch(e => { console.error(e); process.exit(1); });
