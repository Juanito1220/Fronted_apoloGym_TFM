import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../Styles/entrenadores.css";

/* ====== Datos de ejemplo (puedes editar/añadir) ====== */
const TRAINERS = [
  {
    id: "ana",
    name: "Ana López",
    gender: "F",
    level: "Senior",
    specialties: ["Fuerza", "Hipertrofia", "Corrección postural"],
    bio: "Entrenadora con 8 años de experiencia. Programas de fuerza y recomposición corporal.",
    photo: "", // si tienes una URL, colócala aquí
    rating: 4.9,
    slots: ["Lun 07:00-12:00", "Mié 16:00-20:00", "Sáb 09:00-12:00"],
    certificates: ["NSCA-CPT", "MovNat L1"],
  },
  {
    id: "luis",
    name: "Luis Gómez",
    gender: "M",
    level: "Intermedio",
    specialties: ["Pérdida de grasa", "Funcional", "HIIT"],
    bio: "Enfocado en acondicionamiento y hábitos saludables. Rutinas dinámicas.",
    photo: "",
    rating: 4.6,
    slots: ["Mar 06:00-10:00", "Jue 18:00-22:00", "Dom 08:00-11:00"],
    certificates: ["ACE", "Kettlebell L2"],
  },
  {
    id: "tati",
    name: "Tati Vargas",
    gender: "F",
    level: "Senior",
    specialties: ["Movilidad", "Pilates", "Rehabilitación"],
    bio: "Mejoro tu técnica y movilidad para entrenar sin dolor.",
    photo: "",
    rating: 4.8,
    slots: ["Lun 16:00-20:00", "Vie 07:00-11:00"],
    certificates: ["FRCms", "Pilates Reformer"],
  },
  {
    id: "joel",
    name: "Joel Silva",
    gender: "M",
    level: "Junior",
    specialties: ["Fuerza", "Atletismo", "Velocidad"],
    bio: "Ex velocista. Enfoque en potencia y técnica.",
    photo: "",
    rating: 4.4,
    slots: ["Mar 18:00-22:00", "Sáb 08:00-12:00"],
    certificates: ["USATF L1"],
  },
];

/* ====== Página ====== */
export default function Entrenadores() {
  const navigate = useNavigate();

  // filtros
  const [q, setQ] = useState("");
  const [spec, setSpec] = useState("all");
  const [level, setLevel] = useState("all");
  const [gender, setGender] = useState("all");
  const [onlyAvailable, setOnlyAvailable] = useState(false);
  const [modal, setModal] = useState(null); // entrenador activo para el modal

  const SPECIALTIES = useMemo(() => {
    const s = new Set();
    TRAINERS.forEach(t => t.specialties.forEach(x => s.add(x)));
    return Array.from(s);
  }, []);

  const filtered = useMemo(() => {
    const txt = q.trim().toLowerCase();
    return TRAINERS.filter(t => {
      const matchesText =
        !txt ||
        t.name.toLowerCase().includes(txt) ||
        t.specialties.some(s => s.toLowerCase().includes(txt));
      const matchesSpec = spec === "all" || t.specialties.includes(spec);
      const matchesLevel = level === "all" || t.level === level;
      const matchesGender = gender === "all" || t.gender === gender;
      const matchesAvail = !onlyAvailable || (t.slots && t.slots.length > 0);
      return matchesText && matchesSpec && matchesLevel && matchesGender && matchesAvail;
    }).sort((a, b) => b.rating - a.rating);
  }, [q, spec, level, gender, onlyAvailable]);

  const initials = (name) =>
    name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);

  const goBook = (trainerId) => {
    // redirige a tu página de reservas con un query param si quieres prefiltrar por entrenador
    navigate(`/reservas?trainer=${trainerId}`);
  };

  return (
    <div className="tr-page">
      {/* Header */}
      <div className="tr-top">
        <button className="btn-link" onClick={() => navigate("/menu")}>
          ← Regresar al menú
        </button>
        <h1 className="title">Entrenadores</h1>
      </div>

      {/* Filtros */}
      <section className="filters card">
        <input
          className="search"
          type="text"
          placeholder="Buscar por nombre o especialidad…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />

        <div className="row">
          <div>
            <label>Especialidad</label>
            <select value={spec} onChange={(e) => setSpec(e.target.value)}>
              <option value="all">Todas</option>
              {SPECIALTIES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
          <div>
            <label>Nivel</label>
            <select value={level} onChange={(e) => setLevel(e.target.value)}>
              <option value="all">Todos</option>
              <option>Junior</option>
              <option>Intermedio</option>
              <option>Senior</option>
            </select>
          </div>
          <div>
            <label>Sexo</label>
            <select value={gender} onChange={(e) => setGender(e.target.value)}>
              <option value="all">Todos</option>
              <option value="F">Femenino</option>
              <option value="M">Masculino</option>
            </select>
          </div>
          <div className="switch">
            <input
              id="onlyAvail"
              type="checkbox"
              checked={onlyAvailable}
              onChange={(e) => setOnlyAvailable(e.target.checked)}
            />
            <label htmlFor="onlyAvail">Solo con disponibilidad</label>
          </div>
        </div>
      </section>

      {/* Grid de entrenadores */}
      <section className="grid">
        {filtered.map((t) => (
          <article key={t.id} className="card trainer">
            <div className="photo">
              {t.photo ? (
                <img src={t.photo} alt={t.name} />
              ) : (
                <div className="avatar">{initials(t.name)}</div>
              )}
            </div>

            <div className="info">
              <div className="head">
                <h3>{t.name}</h3>
                <div className="rating" title="Valoración">{t.rating.toFixed(1)} ★</div>
              </div>

              <div className="chips">
                <span className="chip level">{t.level}</span>
                {t.specialties.slice(0, 3).map((s) => (
                  <span className="chip" key={s}>{s}</span>
                ))}
                {t.specialties.length > 3 && <span className="chip ghost">+{t.specialties.length - 3}</span>}
              </div>

              <p className="bio">{t.bio}</p>

              <div className="slots">
                {t.slots.slice(0, 3).map((s, i) => (
                  <span className="slot" key={i}>{s}</span>
                ))}
                {t.slots.length === 0 && <span className="slot off">Sin horarios cargados</span>}
              </div>

              <div className="actions">
                <button className="btn" onClick={() => setModal(t)}>Ver perfil</button>
                <button className="btn primary" onClick={() => goBook(t.id)}>Reservar</button>
              </div>
            </div>
          </article>
        ))}

        {!filtered.length && (
          <div className="empty card">No se encontraron entrenadores con esos filtros.</div>
        )}
      </section>

      {/* Modal de perfil */}
      {modal && (
        <div className="modal-mask" onClick={() => setModal(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-head">
              <strong>{modal.name}</strong>
              <button className="close" onClick={() => setModal(null)}>✕</button>
            </div>

            <div className="modal-body">
              <div className="modal-left">
                {modal.photo ? (
                  <img src={modal.photo} alt={modal.name} />
                ) : (
                  <div className="avatar big">{initials(modal.name)}</div>
                )}
                <div className="rating big">{modal.rating.toFixed(1)} ★</div>
                <div className="chip level">{modal.level}</div>
              </div>

              <div className="modal-right">
                <p className="bio">{modal.bio}</p>

                <h4>Especialidades</h4>
                <div className="chips">
                  {modal.specialties.map((s) => (
                    <span className="chip" key={s}>{s}</span>
                  ))}
                </div>

                <h4>Certificaciones</h4>
                <ul className="list">
                  {modal.certificates.map((c) => <li key={c}>{c}</li>)}
                </ul>

                <h4>Horarios</h4>
                <div className="slots">
                  {modal.slots.map((s, i) => <span className="slot" key={i}>{s}</span>)}
                  {modal.slots.length === 0 && <span className="slot off">Sin horarios</span>}
                </div>

                <div className="modal-actions">
                  <button className="btn" onClick={() => setModal(null)}>Cerrar</button>
                  <button className="btn primary" onClick={() => { setModal(null); goBook(modal.id); }}>
                    Reservar con {modal.name.split(" ")[0]}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
