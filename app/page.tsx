 "use client";

import Image from "next/image";
import { type FormEvent, useState } from "react";
import { type InscriptionAgeCategory, INSCRIPTION_AGE_CATEGORIES, INSCRIPTION_SERIES_OPTIONS } from "@/lib/inscription-constants";
import {
  CalendarDays,
  Clock3,
  Compass,
  Mail,
  MapPin,
  ShieldCheck,
  Sparkles,
  Star,
  Telescope,
  Users,
} from "lucide-react";
import MouseAura from "./components/MouseAura";

type ScheduleRow = {
  interval: string;
  day1: string;
  day2: string;
  day3: string;
  day4: string;
  day5: string;
};

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedAgeCategory, setSelectedAgeCategory] = useState<InscriptionAgeCategory>(INSCRIPTION_AGE_CATEGORIES[0]);
  const [formStatus, setFormStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [formError, setFormError] = useState<string | null>(null);
  const currentYear = new Date().getFullYear();

  const schedule: ScheduleRow[] = [
    { interval: "08:30 - 09:30", day1: "Sosire copii", day2: "Sosire copii", day3: "Sosire copii", day4: "Sosire copii", day5: "Sosire copii" },
    { interval: "09:30 - 10:00", day1: "Warm-up și transfer", day2: "Warm-up și transfer", day3: "Warm-up și transfer", day4: "Warm-up și transfer", day5: "Warm-up și transfer" },
    { interval: "10:00 - 11:00", day1: "Marea aventură a materialelor (Știința și Ingineria Materialelor)", day2: "Laboratorul viitorului (FIcBi)", day3: "Micii cercetători. Ce se ascunde în mâncarea noastră? Academia Micilor Brutari (ISB)", day4: "Magia electricității (IE)", day5: "Cum se mișcă lucrurile. Mecanisme inteligente (FIMM)" },
    { interval: "11:00 - 11:20", day1: "Q&A + gustare (fruct)", day2: "Q&A + gustare (fruct)", day3: "Q&A + gustare (fruct)", day4: "Q&A + gustare (fruct)", day5: "Q&A + gustare (fruct)" },
    { interval: "11:20 - 12:40", day1: "Punem lumea în mișcare - simulare circuit. Atelier activitate practică - Orașul inteligent (Transporturi)", day2: "Atelier construit avioane. Activitate practică - Lansare (FIA)", day3: "Unde a dispărut ecoul. Activitate practică în camera anecoică (ISB)", day4: "Puterea fulgerelor (Energetică)", day5: "Atelier robotică (FIIR)" },
    { interval: "12:40 - 13:00", day1: "Transfer - plimbare prin campus", day2: "Transfer", day3: "Transfer - plimbare prin campus", day4: "Transfer - plimbare prin campus", day5: "Transfer - plimbare prin campus" },
    { interval: "13:00 - 14:00", day1: "Prânz", day2: "Prânz", day3: "Prânz", day4: "Prânz", day5: "Prânz" },
    { interval: "14:00 - 15:30", day1: "Atelier creativ - pictură", day2: "Atelier de improvizație teatrală", day3: "Atelier arheologie - Vânătorii de comori", day4: "Workshop Euronews - Micii reporteri", day5: "Workshop dezbateri - Avocat pentru o zi (Facultatea de Drept)" },
    { interval: "15:30 - 16:15", day1: "Știința București - joc și mișcare", day2: "Știința București - joc și mișcare", day3: "Știința București - joc și mișcare", day4: "Știința București - joc și mișcare", day5: "Știința București - joc și mișcare" },
    { interval: "16:15 - 16:30", day1: "Gustare și hidratare", day2: "Gustare și hidratare", day3: "Gustare și hidratare", day4: "Gustare și hidratare", day5: "Gustare și hidratare" },
    { interval: "16:30 - 17:30", day1: "Jocuri distractive", day2: "Jocuri distractive", day3: "Jocuri distractive", day4: "Jocuri distractive", day5: "Jocuri distractive" },
    { interval: "17:30 - 18:00", day1: "Preluare copii", day2: "Preluare copii", day3: "Preluare copii", day4: "Preluare copii", day5: "Preluare copii" },
  ];

  const dayPrograms = [
    { title: "Ziua 1", key: "day1" as const, icon: Sparkles },
    { title: "Ziua 2", key: "day2" as const, icon: Compass },
    { title: "Ziua 3", key: "day3" as const, icon: Star },
    { title: "Ziua 4", key: "day4" as const, icon: CalendarDays },
    { title: "Ziua 5", key: "day5" as const, icon: Telescope },
  ];

  async function handleInscriptionSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError(null);

    const formEl = event.currentTarget;
    const fd = new FormData(formEl);

    const organizationWebsite = String(fd.get("organizationWebsite") ?? "").trim();
    if (organizationWebsite !== "") {
      setFormStatus("success");
      return;
    }

    if (!fd.get("gdpr")) {
      setFormStatus("error");
      setFormError("Este necesar consimțământul pentru prelucrarea datelor.");
      return;
    }

    const seriesValue = fd.get("series");
    const series = typeof seriesValue === "string" ? seriesValue : "";

    const payload = {
      parentName: String(fd.get("parentName") ?? "").trim(),
      phone: String(fd.get("phone") ?? "").trim(),
      email: String(fd.get("email") ?? "").trim(),
      childName: String(fd.get("childName") ?? "").trim(),
      age: Number(fd.get("age")),
      school: String(fd.get("school") ?? "").trim(),
      series,
      medicalInfo: String(fd.get("medicalInfo") ?? "").trim(),
      gdpr: true as const,
      ageCategory: String(fd.get("ageCategory") ?? "").trim() || selectedAgeCategory,
    };

    setFormStatus("submitting");

    try {
      const res = await fetch("/api/inscriere", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(payload),
      });

      let data: { ok?: boolean; error?: string } = {};
      try {
        data = (await res.json()) as { ok?: boolean; error?: string };
      } catch {
        data = {};
      }

      if (!res.ok || !data.ok) {
        setFormStatus("error");
        setFormError(data.error ?? "A apărut o problemă la trimitere. Încearcă din nou.");
        return;
      }

      setFormStatus("success");
      formEl.reset();
      setSelectedAgeCategory(INSCRIPTION_AGE_CATEGORIES[0]);
    } catch {
      setFormStatus("error");
      setFormError("Nu am putut trimite cererea. Verifică conexiunea și încearcă din nou.");
    }
  }

  return (
    <div className="siteWrap">
      <header className="heroPanel" id="intro">
        <MouseAura targetId="intro" />
        <nav className="topNav">
          <div className="topNavRow">
            <a className="brand" href="#intro" onClick={() => setMenuOpen(false)}>
              <span className="brandLogoWrap">
                <Image src="/Logo_RO_PB(ALB)2.svg" alt="POLI Summer Camp" width={60} height={60} />
              </span>
              <span>Poli Summer Camp</span>
            </a>
            <button
              type="button"
              className={`navToggle ${menuOpen ? "isOpen" : ""}`}
              aria-label="Toggle navigation menu"
              aria-expanded={menuOpen}
              aria-controls="site-nav-links"
              onClick={() => setMenuOpen((prev) => !prev)}
            >
              <span />
              <span />
              <span />
            </button>
          </div>
          <div id="site-nav-links" className={`navPills ${menuOpen ? "isOpen" : ""}`}>
            <a href="#despre" onClick={() => setMenuOpen(false)}>Despre</a>
            <a href="#activitati" onClick={() => setMenuOpen(false)}>Activități</a>
            <a href="#program" onClick={() => setMenuOpen(false)}>Program</a>
            <a href="#inscriere" onClick={() => setMenuOpen(false)}>Înscriere</a>
            <a href="#locatie" onClick={() => setMenuOpen(false)}>Locație</a>
            <a href="#contact" onClick={() => setMenuOpen(false)}>Contact</a>
          </div>
        </nav>

        <div className="heroSplit">
          <div className="heroCopy">
            <p className="overline">Inspirație. Joacă. Distracție.</p>
            <h1>Tabăra de vară unde curiozitatea copiilor devine superputere.</h1>
            <p>
              POLITEHNICA București creează un spațiu sigur în care copiii descoperă
              ingineria prin joc, experimente și activități memorabile, alături de mentori pasionați.
            </p>
            <div className="heroCtas">
              <a href="#inscriere" className="btnPrimary">Rezervă locul</a>
              <a href="#activitati" className="btnSoft">Vezi activitățile</a>
            </div>
            <div className="heroMeta">
              <span><Clock3 size={16} /> 08:30 - 18:00</span>
              <span><Users size={16} /> pentru copii între 5-11 ani</span>
            </div>
          </div>

          <div className="heroVisualStack">
            <figure className="heroMainImage">
              <Image src="/8.close-up-smiley-kids-team.jpg" alt="Copii la activități în cadrul taberei" fill priority sizes="(max-width: 900px) 100vw, 46vw" />
            </figure>
            <div className="heroBadgeCard">
              <p>Program pilot</p>
              <strong>POLI SUMMER CAMP</strong>
            </div>
          </div>
        </div>
      </header>

      <main className="contentGrid">
        <section id="despre" className="sectionCard">
          <div className="aboutMosaic">
            <article className="aboutText">
              <h2>Despre taberele noastre</h2>
              <p className="leadText">
                Pentru copii care pun întrebări, desfac jucării să vadă cum funcționează
                și își imaginează viitorul cu entuziasm.
              </p>
              <p>
                Viitor inginer în industria aerospațială? Inginer energetician? Sau poate specialist
                în robotică, materiale inovatoare ori biotehnologii alimentare? Nu putem ști exact
                cum va arăta viitorul, însă știm sigur că ingineria va avea un rol principal.
              </p>
            </article>
            <figure className="mediaCard mediaCardGlow">
              <Image src="/3.kids-using-electronic-parts-build-robot.jpg" alt="Copii în activități educative la POLI Summer Camp" fill sizes="(max-width: 900px) 100vw, 33vw" style={{ objectPosition: "center 15%" }} />
            </figure>
            {/* <div className="aboutSticker">
              <Sparkles size={16} />
              <span>100% learning by doing</span>
            </div> */}
            <div className="benefitList">
              <article><h3><ShieldCheck size={18} /> Siguranță</h3><p>Mediu supravegheat, prietenos, dedicat învățării.</p></article>
              <article><h3><Compass size={18} /> Explorare</h3><p>Ateliere practice care dezvoltă creativitatea și logica.</p></article>
              <article><h3><Sparkles size={18} /> Viitor</h3><p>Primele contacte reale cu lumea fascinantă a ingineriei.</p></article>
            </div>
          </div>
        </section>

        <section id="activitati" className="sectionCard">
          <div className="sectionHeaderRow">
            <h2>Activități</h2>
            <span className="chip">Învățare prin experiență directă</span>
          </div>
          <div className="activitiesShowcase">
            <article className="activitiesNarrative">
              <p>
                Fiecare zi în tabără combină experimentul, jocul și explorarea, astfel încât copiii
                să învețe natural, cu entuziasm și încredere.
              </p>
              <div className="activitiesPillars">
                <article>
                  <h3><Sparkles size={17} /> Experimente</h3>
                  <p>Copiii descoperă concepte de inginerie prin activități practice și captivante.</p>
                </article>
                <article>
                  <h3><Users size={17} /> Colaborare</h3>
                  <p>Lucrează în echipă, își dezvoltă comunicarea și creează proiecte împreună.</p>
                </article>
                <article>
                  <h3><Compass size={17} /> Explorare</h3>
                  <p>Vizitează laboratoare moderne și testează idei noi într-un mediu sigur.</p>
                </article>
              </div>
            </article>

            <div className="activitiesMosaic">
              <figure className="mediaCard mediaCardGlow activityA">
                <Image src="/1.children-using-building-kit.jpg" alt="Copii participând la atelier practic" fill sizes="(max-width: 900px) 100vw, 34vw" />
              </figure>
              <figure className="mediaCard mediaCardGlow activityB">
                <Image src="/5.schoolchildren-working-with-experiment.jpg" alt="Atelier educativ pentru copii" fill sizes="(max-width: 900px) 100vw, 26vw" />
              </figure>
              <figure className="mediaCard mediaCardGlow activityC">
                <Image src="/6.kids-interacting-with-plasma-ball.jpg" alt="Copii explorând experimente științifice în tabără" fill sizes="(max-width: 900px) 100vw, 22vw" />
              </figure>
              {/* <div className="activitySticker">
                <span>+ joacă</span>
                <span>+ știință</span>
                <span>+ prietenie</span>
              </div> */}
            </div>
          </div>
        </section>

        <section id="program" className="sectionCard">
          <div className="sectionHeaderRow">
            <h2>Program și tarife</h2>
            <div className="pillRow">
              <span>08:30 - 18:00</span>
              <span>5 zile</span>
              <span>Mese și materiale incluse</span>
            </div>
          </div>
          <p className="muted">
            Programul combină activități educaționale cu joacă și relaxare, într-un ritm echilibrat.
            Tarifele vor fi actualizate după comunicarea finală a organizatorilor.
          </p>
          <div className="accordionGrid">
            {dayPrograms.map((day, index) => {
              const Icon = day.icon;
              return (
                <details key={day.key} className="dayAccordion" open={index === 0}>
                  <summary>
                    <span><Icon size={17} /> {day.title}</span>
                  </summary>
                  <div className="dayAccordionBody">
                    <ul>
                      {schedule.map((item) => (
                        <li key={`${day.key}-${item.interval}`}>
                          <span>{item.interval}</span>
                          <p>{item[day.key]}</p>
                        </li>
                      ))}
                    </ul>
                  </div>
                </details>
              );
            })}
          </div>
        </section>

        <section id="inscriere" className="sectionCard">
          <div className="sectionHeaderRow">
            <h2>Înscriere</h2>
            <span className="chip chipWarm">Locuri limitate</span>
          </div>
          <div className="signupLayout">
            <div className="signupFormPanel">
              <form className="signupForm" onSubmit={handleInscriptionSubmit}>
                <div className="inscriptionHoneypotWrap" aria-hidden="true">
                  <label>
                    Website organizație
                    <input
                      type="text"
                      name="organizationWebsite"
                      tabIndex={-1}
                      autoComplete="off"
                      defaultValue=""
                    />
                  </label>
                </div>

                <div className="signupFormStatusRegion" aria-live="polite">
                  {formStatus === "submitting" ? (
                    <p className="signupFormStatus signupFormStatusNeutral">Se trimite cererea...</p>
                  ) : null}
                  {formStatus === "success" ? (
                    <p className="signupFormStatus signupFormStatusSuccess">
                      Cererea a fost trimisă. Veți fi contactat în curând pentru confirmare.
                    </p>
                  ) : null}
                  {formStatus === "error" && formError ? (
                    <p className="signupFormStatus signupFormStatusError">{formError}</p>
                  ) : null}
                </div>

                <div className="ageTabs" role="tablist" aria-label="Categorie de vârstă pentru înscriere">
                  {INSCRIPTION_AGE_CATEGORIES.map((category) => (
                    <button
                      key={category}
                      type="button"
                      role="tab"
                      className={`ageTab ${selectedAgeCategory === category ? "isActive" : ""}`}
                      aria-selected={selectedAgeCategory === category}
                      onClick={() => setSelectedAgeCategory(category)}
                    >
                      {category}
                    </button>
                  ))}
                </div>
                <input type="hidden" name="ageCategory" value={selectedAgeCategory} required />

                <fieldset>
                  <legend>Date părinte</legend>
                  <label>Nume și prenume părinte<input type="text" name="parentName" required /></label>
                  <label>Telefon<input type="tel" name="phone" required /></label>
                  <label>E-mail<input type="email" name="email" required /></label>
                </fieldset>

                <fieldset>
                  <legend>Date copil</legend>
                  <label>Nume și prenume copil<input type="text" name="childName" required /></label>
                  <label>Vârsta copilului<input type="number" name="age" min={5} max={11} required /></label>
                  <label>Școala unde este înscris<input type="text" name="school" required /></label>
                </fieldset>

                <fieldset>
                  <legend>Alegerea programului</legend>
                  {INSCRIPTION_SERIES_OPTIONS.map((option) => (
                    <label key={option} className="checkboxLabel radioLabel">
                      <input type="radio" name="series" value={option} required />
                      {option}
                    </label>
                  ))}
                </fieldset>

                <fieldset>
                  <legend>Informații importante</legend>
                  <label>
                    Alergii sau afecțiuni medicale (dacă este cazul)
                    <textarea name="medicalInfo" rows={4} required />
                  </label>
                </fieldset>

                <label className="checkboxLabel">
                  <input type="checkbox" name="gdpr" required />
                  Sunt de acord cu prelucrarea datelor personale pentru înscrierea în tabără.
                </label>
                <button type="submit" disabled={formStatus === "submitting"} aria-busy={formStatus === "submitting"}>
                  Înscrie copilul
                </button>
              </form>
            </div>

            <aside className="signupInfo signupInfoPanel">
              <h3>Ce se întâmplă după trimitere?</h3>
              <ol>
                <li>Primești confirmarea de primire a cererii.</li>
                <li>Echipa noastră te contactează pentru validare.</li>
                <li>Primești detaliile complete pentru participare.</li>
              </ol>
              <p>
                Datele sunt utilizate exclusiv pentru organizarea taberei și comunicarea cu părinții,
                în conformitate cu legislația privind protecția datelor.
              </p>
              <p>
                Linkurile de plată vor fi comunicate separat: un link pentru participanți externi și
                un link pentru participanți interni.
              </p>
              <div className="signupPulseCard">
                <Users size={18} />
                <span>Comunitate de copii curioși + mentori inspiraționali</span>
              </div>
            </aside>
          </div>
        </section>

        <section id="locatie" className="sectionCard">
          <div className="sectionHeaderRow">
            <h2>Locație</h2>
            <span className="chip"><MapPin size={15} /> Campus UPB</span>
          </div>
          <p className="locationDescription" style={{ fontSize: '14px' }}>
            Taberele se desfășoară în campusul modern al Universității Naționale de Știință
            și Tehnologie POLITEHNICA București, un spațiu sigur, verde și dedicat învățării.
          </p>
     
          <div className="locationCollage collageCreative">
            <figure className="mediaCard wide mediaCardGlow"><Image src="/campus-poli.jpg" alt="Campus POLITEHNICA București" fill sizes="(max-width: 900px) 100vw, 38vw" /></figure>
            <figure className="mediaCard mediaCardGlow"><Image src="/ss-campus.png" alt="Campus POLITEHNICA București" fill sizes="(max-width: 900px) 100vw, 30vw" /></figure>
            <figure className="mediaCard mediaCardGlow"><Image src="/despre_noi.jpg" alt="Copii în activități educative la POLI Summer Camp" fill sizes="(max-width: 900px) 100vw, 30vw" /></figure>
          </div>
          <div className="locationFacts">
            <span>Spații moderne</span>
            <span>Zonă verde extinsă</span>
            <span>Acces facil în București</span>
          </div>
        </section>
      </main>

      <footer id="contact" className="siteFooter">
        <div className="footerInner">
          <div className="footerBrand">
            <a className="brand footerBrandLink" href="#intro">
              <span className="brandLogoWrap">
                <Image src="/Logo_RO_PB(ALB)2.svg" alt="POLI Summer Camp" width={60} height={60} />
              </span>
              <span>Poli Summer Camp</span>
            </a>
            <p>Inspirație. Joacă. Distracție.</p>
            <p>Splaiul Independenței nr. 313, București</p>
            <a href="mailto:marketing@upb.ro"><Mail size={15} /> marketing@upb.ro</a>
          </div>

          <div className="footerColumn">
            <h3>Pagini</h3>
            <a href="#despre">Despre</a>
            <a href="#activitati">Activități</a>
            <a href="#program">Program și tarife</a>
            <a href="#inscriere">Înscriere</a>
          </div>

          <div className="footerColumn">
            <h3>Acces rapid</h3>
            <a href="#locatie">Locație</a>
            <a href="#contact">Contact</a>
            <a href="#intro">Înapoi sus</a>
          </div>
        </div>
        <p className="copyright">© {currentYear} Poli Summer Camp. Toate drepturile rezervate.</p>
      </footer>
    </div>
  );
}
