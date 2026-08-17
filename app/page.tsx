"use client";

import { FormEvent, MouseEvent, useEffect, useRef, useState } from "react";

type Screen = "start" | "menu" | "about" | "skills" | "gallery" | "project" | "web" | "contact";
type Gallery = "Redes sociales" | "Branding e identidad visual" | "Banners web" | "Inteligencia artificial";

const menu: Array<{ label: string; screen?: Screen; gallery?: Gallery }> = [
  { label: "Quién soy", screen: "about" },
  { label: "Redes sociales", screen: "gallery", gallery: "Redes sociales" },
  { label: "Branding e identidad visual", screen: "gallery", gallery: "Branding e identidad visual" },
  { label: "Banners web", screen: "gallery", gallery: "Banners web" },
  { label: "Diseño web", screen: "web" },
  { label: "Inteligencia artificial", screen: "gallery", gallery: "Inteligencia artificial" },
];

const galleryAssets: Record<Gallery, string[]> = {
  "Redes sociales": ["/projects/electronics-mexico/redes-01.png", "/projects/chili-beans-mexico/redes-01.png", "/projects/mark-sports/redes-01.png"],
  "Branding e identidad visual": ["/projects/general-water-company/branding-01.png"],
  "Banners web": ["/projects/banners-web/seleccion-banners.png"],
  "Inteligencia artificial": ["/projects/inteligencia-artificial/seleccion-ia.png", "/figma/banners-tech.png"],
};

const galleryCharacters: Record<Gallery, {src:string; className:string; alt:string}> = {
  "Redes sociales": {src:"/characters/pablo-social.png",className:"character-gallery-social",alt:"Pablo como explorador con una barra"},
  "Branding e identidad visual": {src:"/characters/pablo-branding.png",className:"character-gallery-branding",alt:"Pablo como explorador con una escopeta"},
  "Banners web": {src:"/characters/pablo-banners.png",className:"character-gallery-banners",alt:"Pablo como explorador con hacha"},
  "Inteligencia artificial": {src:"/characters/pablo-ai.png",className:"character-gallery-ai",alt:"Pablo como explorador con un hacha al hombro"},
};

const socialProjects = [
  {
    name: "ELECTRONICS MÉXICO",
    logo: "/projects/electronics-mexico/logo.png",
    description: "Fundada en 2004, Electronics México es un distribuidor nacional de productos de hardware y software, con más de 40 empleados y tres almacenes de venta ubicados en CDMX, Nuevo Laredo y Veracruz.",
    sector: "TECNOLOGÍA", agency: "KRAB-E", year: "2024",
    images: ["/projects/electronics-mexico/redes-01.png","/projects/electronics-mexico/redes-02.png","/projects/electronics-mexico/redes-03.png"],
  },
  {
    name: "CHILI BEANS MÉXICO",
    logo: "/projects/chili-beans-mexico/logo.png",
    description: "Empresa mexicana de ropa enfocada en crear prendas básicas sin perder un estilo único para cada día. Ofrece moda versátil y de calidad para todos, garantizando una experiencia de compra segura, rápida y confiable.",
    sector: "INDUMENTARIA", agency: "KRAB-E", year: "2024",
    images: ["/projects/chili-beans-mexico/redes-01.png","/projects/chili-beans-mexico/redes-02.png","/projects/chili-beans-mexico/redes-03.png"],
  },
  {
    name: "MARK SPORTS",
    logo: "/projects/mark-sports/logo.png",
    description: "Diseño conceptual de las tiendas comerciales de Mark Sports, pertenecientes al Grupo Dash. Dash es una de las empresas líderes en retail deportivo, con más de 40 años de historia y más de 70 locales propios en toda la Argentina.",
    sector: "DEPORTES", agency: "KRAB-E", year: "2023",
    images: ["/projects/mark-sports/redes-01.png","/projects/mark-sports/redes-02.png","/projects/mark-sports/redes-03.png"],
  },
];

const brandingProjects = [
  {
    name: "GENERAL WATER COMPANY",
    logo: "/projects/general-water-company/logo.png",
    description: "GWC Store es una empresa internacional especializada en el desarrollo de tecnologías para el tratamiento del agua. En su e-commerce ofrece una amplia gama de productos, incluyendo dispensadores, filtros, ablandadores y más.",
    sector: "AGUA", agency: "KRAB-E", year: "2023",
    images: ["/projects/general-water-company/branding-01.png","/projects/general-water-company/branding-02.png"],
  },
];

const bannerProjects = [
  {
    name: "SELECCIÓN DE BANNERS WEB",
    logo: "",
    description: "En esta sección presento una selección de mis diseños de banners web, destacando la combinación de creatividad y funcionalidad. Cada pieza está diseñada pensando en la identidad de la marca y en captar la atención del público objetivo, logrando un equilibrio entre la estética y la comunicación efectiva.",
    sector: "DISEÑO DIGITAL", agency: "DIVERSAS MARCAS", year: "SELECCIÓN",
    images: ["/projects/banners-web/seleccion-banners.png"],
  },
];

const aiProjects = [
  {
    name: "IA APLICADA AL DISEÑO",
    logo: "",
    description: "La inteligencia artificial forma parte de mi proceso como una herramienta para explorar ideas, agilizar etapas y ampliar las posibilidades visuales, siempre bajo mi criterio como diseñador. Trabajo con relleno generativo y generación de imágenes y videos, integrando Photoshop, ChatGPT, Sora, Google AI Studio, Gemini y Midjourney para construir resultados sólidos y realistas. Aproximadamente el 80% de este portfolio fue desarrollado mediante este flujo de trabajo combinado.",
    sector: "DISEÑO E INTELIGENCIA ARTIFICIAL", agency: "PROYECTOS DIVERSOS", year: "2024–2026",
    images: ["/projects/inteligencia-artificial/seleccion-ia.png"],
  },
];

export default function Home() {
  const [screen, setScreen] = useState<Screen>("start");
  const [gallery, setGallery] = useState<Gallery>("Redes sociales");
  const [transitioning, setTransitioning] = useState(false);
  const [access, setAccess] = useState(false);
  const [accessOpen, setAccessOpen] = useState(false);
  const [accessError, setAccessError] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [projectSlide, setProjectSlide] = useState(0);
  const [selectedProject, setSelectedProject] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const previousScreen = useRef<Screen>("start");
  const sounds = useRef<Record<string, HTMLAudioElement>>({});
  const accessForm = useRef<HTMLFormElement>(null);
  const galleryCharacter = galleryCharacters[gallery];
  const galleryProjects = gallery === "Redes sociales" ? socialProjects : gallery === "Branding e identidad visual" ? brandingProjects : gallery === "Banners web" ? bannerProjects : aiProjects;
  const currentProject = galleryProjects[selectedProject] || socialProjects[0];
  const slideTotal = currentProject.images.length;

  useEffect(() => {
    sounds.current = {
      inicio: new Audio("/audio/inicio.mp3"),
      menu: new Audio("/audio/menu.mp3"),
      click: new Audio("/audio/click.mp3"),
      secciones: new Audio("/audio/secciones.mp3"),
    };
    Object.values(sounds.current).forEach(audio => { audio.preload = "auto"; audio.volume = .48; });
    sounds.current.click.volume = .3;
    return () => Object.values(sounds.current).forEach(audio => { audio.pause(); audio.src = ""; });
  }, []);

  useEffect(() => {
    if (screen === previousScreen.current) return;
    previousScreen.current = screen;
    if (!soundEnabled) return;
    playSound(screen === "menu" ? "menu" : "secciones");
  }, [screen, soundEnabled]);

  useEffect(() => {
    const key = (e: KeyboardEvent) => {
      if (e.key === "Escape" && lightboxOpen) setLightboxOpen(false);
      else if (e.key === "Escape" && screen === "project") go("gallery");
      else if (e.key === "Escape" && screen !== "start") go("menu");
      if (e.key === "Enter" && screen === "start") go("menu");
      if (screen === "project" && !lightboxOpen && e.key === "ArrowLeft") setProjectSlide(value => (value + slideTotal - 1) % slideTotal);
      if (screen === "project" && !lightboxOpen && e.key === "ArrowRight") setProjectSlide(value => (value + 1) % slideTotal);
    };
    window.addEventListener("keydown", key);
    return () => window.removeEventListener("keydown", key);
  }, [screen, lightboxOpen, slideTotal]);

  function go(next: Screen) {
    if (next === screen || transitioning) return;
    setTransitioning(true);
    window.setTimeout(() => { setScreen(next); window.setTimeout(() => setTransitioning(false), 70); }, 330);
  }

  function playSound(name: string) {
    const audio = sounds.current[name];
    if (!audio) return;
    if (name !== "click") {
      ["inicio", "menu", "secciones"].forEach(key => {
        const current = sounds.current[key];
        if (current && current !== audio) { current.pause(); current.currentTime = 0; }
      });
    }
    audio.currentTime = 0;
    void audio.play().catch(() => {});
  }

  function startExperience() {
    go("menu");
  }

  function toggleSound() {
    setSoundEnabled(current => {
      const next = !current;
      if (!next) {
        ["inicio", "menu", "secciones"].forEach(key => {
          const audio = sounds.current[key];
          if (audio) { audio.pause(); audio.currentTime = 0; }
        });
      } else {
        playSound(screen === "start" ? "inicio" : screen === "menu" ? "menu" : "secciones");
      }
      return next;
    });
  }

  function handleInterfaceClick(e: MouseEvent<HTMLElement>) {
    const target = e.target as HTMLElement;
    if (target.closest("button, a")) playSound("click");
  }

  function openGallery(next: Gallery) { setGallery(next); go("gallery"); }
  function openProject(index: number) { setSelectedProject(index); setProjectSlide(0); go("project"); }
  function switchProject(index: number) { setSelectedProject(index); setProjectSlide(0); }

  function unlock(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    validateAccess(e.currentTarget);
  }

  function validateAccess(form: HTMLFormElement | null) {
    if (!form) return;
    const value = String(new FormData(form).get("key") || "").trim().toLowerCase();
    if (value === "nivel2") { setAccess(true); setAccessOpen(false); setAccessError(false); }
    else setAccessError(true);
  }

  return (
    <main className={`game screen-${screen} ${transitioning ? "is-transitioning" : ""}`} onClickCapture={handleInterfaceClick}>
      <div className="grain" />
      <div className="cinema top" /><div className="cinema bottom" />
      {screen !== "start" && screen !== "menu" && screen !== "contact" && <button className="home-logo" onClick={() => go("start")} aria-label="Volver al inicio"><img src="/brand/logo-pablo-horizontal.png" alt="Pablo Fonteñez" /></button>}
      <button className={`sound-toggle ${soundEnabled ? "is-on" : ""}`} onClick={toggleSound} aria-label={soundEnabled ? "Silenciar música" : "Activar música"}><span className="sound-icon" aria-hidden="true">{soundEnabled ? "♪" : "×"}</span><span>{soundEnabled ? "MÚSICA ACTIVADA" : "ACTIVAR MÚSICA"}</span></button>

      {screen === "start" && <section className="scene start-scene">
        <video className="scene-bg start-bg start-video" autoPlay muted loop playsInline poster="/backgrounds/window.webp" aria-label="Ventana de un edificio abandonado con vegetación movida por una brisa suave"><source src="/backgrounds/window-motion.mp4" type="video/mp4" /></video>
        <div className="start-shade" />
        <img className="start-logo" src="/brand/logo-pablo-horizontal.png" alt="Pablo Fonteñez — Diseñador gráfico" />
        <button className="figma-button start-button" onClick={startExperience}><span>INICIAR</span></button>
        <p className="key-hint">ENTER PARA INICIAR</p>
      </section>}

      {screen === "menu" && <section className="scene menu-scene">
        <img className="scene-bg menu-bg" src="/backgrounds/church.webp" alt="Iglesia abandonada recuperada por la naturaleza" />
        <img className="scene-character character-menu" src="/characters/pablo-archer.webp" alt="Pablo como explorador con arco" />
        <div className="menu-vignette" />
        <div className="menu-panel">
          <button className="menu-logo-button" onClick={() => go("start")} aria-label="Volver al inicio"><img className="menu-logo" src="/brand/logo-pablo-horizontal.png" alt="Pablo Fonteñez — Diseñador gráfico" /></button>
          <nav className="main-menu" aria-label="Menú principal">
            {menu.map((item, index) => <button key={item.label} onClick={() => item.gallery ? openGallery(item.gallery) : go(item.screen || "menu")}><i>{String(index + 1).padStart(2,"0")}</i><span>{item.label}</span><b>›</b></button>)}
          </nav>
          <div className="menu-actions">
            <button onClick={() => go("contact")}>CONTACTO</button>
            <button className={access ? "level active" : "level"} onClick={() => setAccessOpen(true)}>{access ? "NIVEL 2 DESBLOQUEADO" : "CLIENTES · NIVEL 2"}</button>
          </div>
        </div>
        <div className="game-status"><span>PLAYER</span><b>PABLO FONTEÑEZ</b><i>ONLINE</i></div>
      </section>}

      {screen === "about" && <section className="scene about-scene">
        <img className="scene-bg about-bg" src="/backgrounds/pergola.webp" alt="Pérgola abandonada recuperada por la naturaleza" />
        <img className="scene-character character-about" src="/characters/pablo-action.png" alt="Pablo como explorador en pose de acción" />
        <div className="right-shade" />
        <Back onClick={() => go("menu")} />
        <div className="about-copy"><span className="screen-label">PERFIL / PLAYER 01</span><h1>QUIÉN SOY</h1><p>Soy Pablo Fonteñez, diseñador gráfico con más de 15 años de experiencia. Trabajé en identidad visual, comunicación institucional y diseño de piezas para distintos medios, buscando siempre que cada proyecto sea claro, atractivo y funcional.</p><p>Durante el último año amplié mi trabajo hacia la comunicación digital y audiovisual: contenido para redes, campañas, presentaciones, páginas web, reels y videos institucionales. Me gusta involucrarme en todo el proceso, desde la idea y la organización del contenido hasta el diseño, la edición y su adaptación a cada formato.</p><p>Hoy mi perfil combina diseño gráfico, contenido digital, edición audiovisual, desarrollo web e inteligencia artificial para conectar la idea, la imagen, el movimiento y la experiencia final.</p><button className="about-skills-link" onClick={() => go("skills")}>INVENTARIO DE HABILIDADES <span>→</span></button></div>
        <div className="contact-chips"><a href="mailto:pabloezequielfontenez@gmail.com">pabloezequielfontenez@gmail.com</a><a href="https://www.linkedin.com/in/pfontenez/" target="_blank">linkedin.com/in/pfontenez/</a><a href="https://wa.me/541134145166?text=Hola%20Pablo%2C%20vi%20tu%20portfolio%20y%20quer%C3%ADa%20contactarte." target="_blank">WhatsApp · 11 3414-5166</a></div>
      </section>}

      {screen === "skills" && <section className="scene skills-scene">
        <img className="scene-bg skills-bg" src="/backgrounds/stadium.webp" alt="Estadio abandonado recuperado por la naturaleza" /><img className="scene-character character-skills" src="/characters/pablo-front.png" alt="Pablo como explorador de frente" /><div className="skills-shade" />
        <Back onClick={() => go("about")} label="VOLVER AL PERFIL" />
        <div className="skills-content"><span className="screen-label">INVENTARIO / HABILIDADES</span><h1>SKILLS Y MÁS</h1>
          <div className="resume-grid">
            <article className="resume-card education-card"><h2>EDUCACIÓN</h2>
              <div className="education-item"><b>AFTER EFFECTS Y PREMIERE</b><span>En curso.</span></div>
              <div className="education-item"><b>DISEÑO UX/UI</b><span>Research, diseño y prototipado basado en MVP. Metodologías ágiles, Optimal Workshop, Useberry y Figma.</span></div>
              <div className="education-item"><b>DISEÑO UX/UI AVANZADO</b><span>Análisis de tendencias, Lean UX Canvas, pain points, tree testing, UX Writing y Motion.</span></div>
            </article>
            <article className="resume-card software-card"><h2>SOFTWARE SKILLS</h2>
              {[["Ps","PHOTOSHOP","Diseño y edición de imágenes"],["Ai","ILLUSTRATOR","Diseño vectorial y maquetación"],["Fi","FIGMA","Interfaces y prototipado"],["Pr","PREMIERE PRO","Edición y montaje de video"],["Ae","AFTER EFFECTS","Motion y animación"]].map(([icon,name,detail]) => <div className="software-row" key={name}><span className="software-icon" aria-label={`Espacio reservado para el ícono de ${name}`}>{icon}</span><span><b>{name}</b><small>{detail}</small></span></div>)}
            </article>
            <article className="resume-card experience-card"><h2>EXPERIENCIA</h2><div className="timeline">
              <div><span>2025 — ACTUALIDAD</span><b>SIEMPRE ARG</b><small>DISEÑADOR GRÁFICO Y DIGITAL</small></div>
              <div><span>Julio 2021 — Febrero 2025</span><b>KRAB-E</b><small>DISEÑADOR GRÁFICO</small></div>
              <div><span>Febrero 2020 — Julio 2021</span><b>SEARCH</b><small>DISEÑADOR GRÁFICO</small></div>
              <div><span>Mayo 2014 — Agosto 2017</span><b>ESTUDIO 33</b><small>DISEÑADOR GRÁFICO FREELANCE</small></div>
            </div></article>
            <article className="resume-card abilities-card"><h2>HABILIDADES</h2><ul><li>Atención al detalle</li><li>Organización y gestión del tiempo</li><li>Creatividad y criterio visual</li><li>Comunicación y trabajo en equipo</li><li className="ai-ability">Manejo de inteligencia artificial<small>Creación visual, prompts y optimización de contenidos.</small></li></ul></article>
            <article className="resume-card activities-card"><h2>ACTIVIDADES FRECUENTES</h2><ul><li>Contenido para redes sociales</li><li>Edición de reels y videos institucionales</li><li>Presentaciones corporativas</li><li>Diseño y revisión de páginas web</li><li>Desarrollo visual con inteligencia artificial</li></ul></article>
          </div>
        </div>
      </section>}

      {screen === "web" && <section className="scene web-scene">
        <img className="scene-bg web-bg" src="/backgrounds/horse-statue.webp" alt="Estatua ecuestre en una ciudad recuperada por la naturaleza" />
        <div className="web-shade" />
        <img className="scene-character character-web" src="/characters/pablo-web.png" alt="Pablo como explorador frente a sus proyectos web" />
        <Back onClick={() => go("menu")} />
        <div className="web-header"><span className="screen-label">ARCHIVO / DESARROLLO WEB</span><h1>DISEÑO WEB</h1><p>Proyectos diseñados y desarrollados para experiencias digitales.</p></div>
        <div className="web-projects">
          {[{name:"SIEMPRE ARGENTINA",preview:"/projects/diseno-web/siempre-argentina.png",url:"https://pfontenez.github.io/siemprearg-nuevo-FINAL-responsive/"},{name:"INVITACIÓN FRANCHESCA",preview:"/projects/diseno-web/invitacion-franchesca.png",url:"https://pfontenez.github.io/invitacion-franchesca/"}].map((project,index) => <button key={project.name} className={`web-project ${!access ? "is-locked" : project.url ? "is-ready" : "is-pending"}`} onClick={() => !access ? setAccessOpen(true) : project.url ? window.open(project.url,"_blank","noopener,noreferrer") : undefined}>
            {project.preview && <img className="web-project-preview" src={project.preview} alt="Vista previa del sitio web de Siempre Argentina" />}
            <span className="web-project-number">0{index + 1}</span><div><small>PROYECTO WEB</small><h2>{access ? project.name : `PROYECTO 0${index + 1}`}</h2><p>{!access ? "CONTENIDO PROTEGIDO" : project.url ? "ABRIR SITIO WEB" : "ENLACE DE GITHUB PENDIENTE"}</p></div><b>{!access ? "NIVEL 2 · INGRESAR CÓDIGO" : project.url ? "EXPLORAR ↗" : "PRÓXIMAMENTE"}</b>
          </button>)}
        </div>
      </section>}

      {screen === "gallery" && <section className="scene gallery-scene">
        <img className="scene-bg gallery-bg" src="/backgrounds/city.webp" alt="Ciudad abandonada recuperada por la naturaleza" /><img className={`scene-character character-gallery ${galleryCharacter.className}`} src={galleryCharacter.src} alt={galleryCharacter.alt} /><div className="gallery-shade" />
        <Back onClick={() => go("menu")} />
        <div className="gallery-header"><span className="screen-label">ARCHIVO DE TRABAJOS</span><h1>{gallery}</h1><p>Selección de proyectos y piezas desarrolladas para distintas marcas.</p></div>
        <div className={`gallery-track gallery-count-${galleryAssets[gallery].length}`}>{galleryAssets[gallery].map((src,index) => <button key={`${src}-${index}`} className={`work-card ${!access ? "is-locked" : ""}`} onClick={() => !access ? setAccessOpen(true) : index < galleryProjects.length ? openProject(index) : undefined}><img src={src} alt={`${gallery} — proyecto ${index + 1}`} /><span>{access && index < galleryProjects.length ? galleryProjects[index].name : `PROYECTO ${String(index+1).padStart(2,"0")}`}</span>{!access && <b className="locked">NIVEL 2 · INGRESAR CÓDIGO</b>}</button>)}</div>
        <div className="gallery-counter">01 <span>/</span> {String(galleryAssets[gallery].length).padStart(2,"0")}</div>
      </section>}

      {screen === "project" && <section className="scene project-scene">
        <img className="scene-bg project-bg" src="/backgrounds/city.webp" alt="" />
        <div className="project-shade" />
        <Back onClick={() => go("gallery")} label={gallery === "Redes sociales" ? "VOLVER A REDES SOCIALES" : gallery === "Branding e identidad visual" ? "VOLVER A BRANDING" : gallery === "Banners web" ? "VOLVER A BANNERS WEB" : "VOLVER A INTELIGENCIA ARTIFICIAL"} />
        <div className="project-info">
          <span className="screen-label">ARCHIVO DESBLOQUEADO / CLIENTE {String(selectedProject + 1).padStart(2,"0")}</span>
          {currentProject.logo ? <img className="project-logo" src={currentProject.logo} alt={currentProject.name} /> : <h2 className="project-title">{currentProject.name}</h2>}
          <p>{currentProject.description}</p>
          <dl><div><dt>SECTOR</dt><dd>{currentProject.sector}</dd></div><div><dt>AGENCIA</dt><dd>{currentProject.agency}</dd></div><div><dt>AÑO</dt><dd>{currentProject.year}</dd></div></dl>
          {galleryProjects.length > 1 && <div className="project-switcher">
            <button className="project-switch" onClick={() => switchProject((selectedProject + galleryProjects.length - 1) % galleryProjects.length)}>← ANTERIOR</button>
            <button className="project-switch" onClick={() => switchProject((selectedProject + 1) % galleryProjects.length)}>SIGUIENTE →</button>
          </div>}
        </div>
        <div className="project-viewer">
          {slideTotal > 1 ? <button className="project-arrow previous" onClick={() => setProjectSlide(value => (value + slideTotal - 1) % slideTotal)} aria-label="Imagen anterior">←</button> : <span />}
          <button className="project-image-button" onClick={() => setLightboxOpen(true)} aria-label="Ampliar imagen">
            <img src={currentProject.images[projectSlide]} alt={`Trabajos para ${currentProject.name} — lámina ${projectSlide + 1}`} />
            <span>AMPLIAR IMAGEN</span>
          </button>
          {slideTotal > 1 ? <button className="project-arrow next" onClick={() => setProjectSlide(value => (value + 1) % slideTotal)} aria-label="Imagen siguiente">→</button> : <span />}
          <div className="project-pagination">{currentProject.images.map((_,index) => <button key={index} className={index === projectSlide ? "active" : ""} onClick={() => setProjectSlide(index)} aria-label={`Ver lámina ${index + 1}`}>{String(index + 1).padStart(2,"0")}</button>)}</div>
          <div className="project-count">{String(projectSlide + 1).padStart(2,"0")} <span>/</span> {String(slideTotal).padStart(2,"0")}</div>
        </div>
        {lightboxOpen && <div className="project-lightbox" onClick={() => setLightboxOpen(false)}>
          <button className="lightbox-close" onClick={() => setLightboxOpen(false)} aria-label="Cerrar imagen">×</button>
          <img onClick={e => e.stopPropagation()} src={currentProject.images[projectSlide]} alt={`Trabajos para ${currentProject.name} — lámina ${projectSlide + 1} ampliada`} />
        </div>}
      </section>}

      {screen === "contact" && <section className="scene contact-scene">
        <img className="scene-bg contact-bg" src="/backgrounds/window.webp" alt="Ventana de un edificio abandonado recuperado por la naturaleza" /><div className="contact-shade" /><Back onClick={() => go("menu")} />
        <img className="thanks-logo" src="/brand/logo-pablo-horizontal.png" alt="Pablo Fonteñez — Diseñador gráfico" />
        <div className="contact-box"><span className="screen-label">FIN DE LA MISIÓN</span><h1>MUCHAS GRACIAS</h1><a href="mailto:pabloezequielfontenez@gmail.com"><small>CORREO</small>pabloezequielfontenez@gmail.com</a><a href="https://www.linkedin.com/in/pfontenez/" target="_blank"><small>LINKEDIN</small>linkedin.com/in/pfontenez/</a><a href="tel:+541134145166"><small>CELULAR</small>11 3414-5166</a></div>
      </section>}

      {accessOpen && <div className="access-overlay" onMouseDown={() => setAccessOpen(false)}><div className="access-dialog" onMouseDown={e=>e.stopPropagation()}><button className="x" onClick={() => setAccessOpen(false)}>×</button><span className="screen-label">ACCESS RESTRICTED</span><h2>SE REQUIERE<br/>ACCESO NIVEL 2</h2><p>Ingresá la clave compartida para desbloquear los proyectos de clientes.</p><form ref={accessForm} onSubmit={unlock}><input name="key" autoFocus placeholder="CLAVE DE ACCESO"/><button type="submit">DESBLOQUEAR</button></form>{accessError && <small>Clave incorrecta. Para la demo usá “nivel2”.</small>}<i>SECURITY CLEARANCE · LEVEL 02</i></div></div>}
    </main>
  );
}

function Back({onClick,label="VOLVER AL MENÚ"}:{onClick:()=>void;label?:string}) { return <button className="back" onClick={onClick}><span>←</span>{label}</button>; }
