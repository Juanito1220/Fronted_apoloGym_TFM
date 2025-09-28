import React, { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import BackToMenu from "../../Componentes/backtoMenu";
import "../../Styles/pagos.css";

/* ======= Datos de ejemplo ======= */
const PLANS = [
  { id: "black", name: "Plan Black", price: 29.9 },
  { id: "fit",   name: "Plan Fit",   price: 21.9 },
  { id: "smart", name: "Plan Smart", price: 25.9 },
];
const TAX_RATE = 0.12;       // IVA 12%
const COUPONS = {            // cupones demo
  BIENVENIDA10: 0.10,        // 10% off
  GYM5: 0.05
};
const PAY_KEY = "demo_pagos"; // clave única para Historial

/* ======= Utilidades ======= */
const money = (n) => n.toLocaleString("es-EC", { style: "currency", currency: "USD" });
const onlyDigits = (s) => s.replace(/\D+/g, "");

// Luhn (verificación básica de tarjeta)
function luhnCheck(num) {
  const s = onlyDigits(num);
  let sum = 0, alt = false;
  for (let i = s.length - 1; i >= 0; i--) {
    let n = parseInt(s[i], 10);
    if (alt) { n *= 2; if (n > 9) n -= 9; }
    sum += n; alt = !alt;
  }
  return (sum % 10) === 0 && s.length >= 13 && s.length <= 19;
}
function isFuture(mm, yy) {
  const m = Number(mm), y = Number("20" + yy);
  if (!m || !y) return false;
  const now = new Date();
  const exp = new Date(y, m, 0);
  return exp >= new Date(now.getFullYear(), now.getMonth(), 1);
}
function randomReceipt() {
  return "AP-" + Math.random().toString(36).slice(2, 8).toUpperCase();
}

export default function Pagos() {
  const navigate = useNavigate();

  // estado general
  const [planId, setPlanId] = useState(PLANS[0].id);
  const [coupon, setCoupon] = useState("");
  const [method, setMethod] = useState("card"); // card | transfer | cash

  // datos del cliente
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  // tarjeta
  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expMonth, setExpMonth] = useState("");
  const [expYear, setExpYear] = useState("");
  const [cvv, setCvv] = useState("");

  // UI
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(null); // {id, total, plan}

  const plan = PLANS.find((p) => p.id === planId);

  const discountRate = useMemo(() => {
    const code = coupon.trim().toUpperCase();
    return COUPONS[code] || 0;
  }, [coupon]);

  const subtotal = plan.price;
  const discount = subtotal * discountRate;
  const taxedBase = Math.max(0, subtotal - discount);
  const tax = taxedBase * TAX_RATE;
  const total = taxedBase + tax;

  // formateo de número de tarjeta (XXXX XXXX XXXX ...)
  const formatCardNumber = (v) =>
    onlyDigits(v).slice(0, 19).replace(/(\d{4})(?=\d)/g, "$1 ");

  // validaciones
  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const nameOk = name.trim().length >= 2;

  const cardOk =
    method !== "card" ||
    (cardName.trim().length >= 2 &&
      luhnCheck(cardNumber) &&
      /^\d{2}$/.test(expMonth) &&
      /^\d{2}$/.test(expYear) &&
      Number(expMonth) >= 1 &&
      Number(expMonth) <= 12 &&
      isFuture(expMonth, expYear) &&
      /^\d{3,4}$/.test(cvv));

  const canPay = nameOk && emailOk && (method !== "card" || cardOk) && !submitting;

  async function handlePay(e) {
    e.preventDefault();
    if (!canPay) return;
    setSubmitting(true);
    setSuccess(null);

    const receipt = {
      id: randomReceipt(),
      ts: new Date().toISOString(),
      plan: plan.name,
      subtotal,
      discount,
      tax,
      total,
      method,
      name,
      email,
      last4: method === "card" ? onlyDigits(cardNumber).slice(-4) : null,
    };

    // Guardar en localStorage (para Historial)
    try {
      const prev = JSON.parse(localStorage.getItem(PAY_KEY) || "[]");
      prev.unshift(receipt);
      localStorage.setItem(PAY_KEY, JSON.stringify(prev));
    } catch {}

    // limpiar datos sensibles de tarjeta
    setCardNumber("");
    setCvv("");

    setSuccess({ id: receipt.id, total: receipt.total, plan: receipt.plan });
    setSubmitting(false);
  }

  return (
    <div className="pay-page">
      {/* Top */}
      <div className="pay-top">
        <BackToMenu /> {/* ← botón estándar */}
        <h1 className="title">Pagos</h1>
      </div>

      {/* Mensaje de éxito no modal */}
      {success && (
        <div className="success-box" role="status" aria-live="polite">
          <div className="sb-title">Pago registrado correctamente</div>
          <div className="sb-body">
            Comprobante: <strong>{success.id}</strong> · Plan: <strong>{success.plan}</strong> · Total: <strong>{money(success.total)}</strong>
          </div>
          <div className="sb-actions">
            <Link className="btn outline" to="/historial">Ver historial</Link>
            <button className="btn link" onClick={()=>setSuccess(null)}>Cerrar</button>
          </div>
        </div>
      )}

      <form className="grid" onSubmit={handlePay}>
        {/* Panel izquierdo: datos y método */}
        <section className="card left">
          <h2 className="h2">Datos del cliente</h2>
          <div className="row two">
            <div>
              <label>Nombre y apellido</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ej. Ana López"
                required
              />
            </div>
            <div>
              <label>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ana@example.com"
                required
              />
              {!emailOk && email.length > 0 && <small className="err">Email inválido</small>}
            </div>
          </div>

          <div className="row">
            <label>Plan</label>
            <select value={planId} onChange={(e) => setPlanId(e.target.value)}>
              {PLANS.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} — {money(p.price)}
                </option>
              ))}
            </select>
          </div>

          <div className="row two">
            <div>
              <label>Cupón</label>
              <input
                type="text"
                value={coupon}
                onChange={(e) => setCoupon(e.target.value)}
                placeholder="Ej. BIENVENIDA10"
              />
              {discountRate > 0 && (
                <small className="ok">Cupón aplicado: {Math.round(discountRate * 100)}% off</small>
              )}
            </div>
            <div>
              <label>Método de pago</label>
              <div className="tabs">
                <button type="button" className={`tab ${method === "card" ? "active" : ""}`} onClick={() => setMethod("card")}>Tarjeta</button>
                <button type="button" className={`tab ${method === "transfer" ? "active" : ""}`} onClick={() => setMethod("transfer")}>Transferencia</button>
                <button type="button" className={`tab ${method === "cash" ? "active" : ""}`} onClick={() => setMethod("cash")}>Efectivo</button>
              </div>
            </div>
          </div>

          {method === "card" && (
            <div className="cardbox">
              <h3>Datos de la tarjeta</h3>
              <div className="row">
                <label>Nombre en la tarjeta</label>
                <input
                  type="text"
                  value={cardName}
                  onChange={(e) => setCardName(e.target.value)}
                  placeholder="Como aparece en la tarjeta"
                  required
                />
              </div>
              <div className="row two">
                <div>
                  <label>Número</label>
                  <input
                    inputMode="numeric"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                    placeholder="1234 5678 9012 3456"
                    maxLength={22} // 19 dígitos + 3 espacios
                    required
                  />
                  {cardNumber && !luhnCheck(cardNumber) && (
                    <small className="err">Número inválido</small>
                  )}
                </div>
                <div className="two">
                  <div>
                    <label>MM</label>
                    <input
                      inputMode="numeric"
                      maxLength={2}
                      value={expMonth}
                      onChange={(e) => setExpMonth(onlyDigits(e.target.value).slice(0, 2))}
                      placeholder="MM"
                      required
                    />
                  </div>
                  <div>
                    <label>YY</label>
                    <input
                      inputMode="numeric"
                      maxLength={2}
                      value={expYear}
                      onChange={(e) => setExpYear(onlyDigits(e.target.value).slice(0, 2))}
                      placeholder="YY"
                      required
                    />
                  </div>
                  <div>
                    <label>CVV</label>
                    <input
                      inputMode="numeric"
                      maxLength={4}
                      value={cvv}
                      onChange={(e) => setCvv(onlyDigits(e.target.value).slice(0, 4))}
                      placeholder="***"
                      required
                    />
                  </div>
                </div>
              </div>
              {!isFuture(expMonth, expYear) && expMonth && expYear && (
                <small className="err">La tarjeta está vencida</small>
              )}
            </div>
          )}

          {method === "transfer" && (
            <div className="help">
              <h3>Datos para transferencia</h3>
              <p><strong>Banco:</strong> Banco Demo</p>
              <p><strong>Cuenta:</strong> 1234567890</p>
              <p><strong>Titular:</strong> Apolo Gym</p>
              <p>Envíanos el comprobante a <strong>pagos@apolo-gym.com</strong>. Confirmaremos tu plan al verificarlo.</p>
            </div>
          )}

          {method === "cash" && (
            <div className="help">
              <h3>Pago en efectivo</h3>
              <p>Acércate a recepción. Reservaremos el plan por 24 horas.</p>
            </div>
          )}
        </section>

        {/* Panel derecho: resumen */}
        <aside className="card right">
          <h2 className="h2">Resumen</h2>
          <div className="sum-line"><span>Plan</span><span>{plan.name}</span></div>
          <div className="sum-line"><span>Subtotal</span><span>{money(subtotal)}</span></div>
          <div className="sum-line"><span>Descuento</span><span>- {money(discount)}</span></div>
          <div className="sum-line"><span>Base imponible</span><span>{money(taxedBase)}</span></div>
          <div className="sum-line"><span>IVA ({Math.round(TAX_RATE*100)}%)</span><span>{money(tax)}</span></div>
          <div className="sum-line total"><span>Total</span><span>{money(total)}</span></div>

          <button className="btn primary big" disabled={!canPay} type="submit">
            {method === "card" ? (submitting ? "Procesando..." : "Pagar ahora") : (submitting ? "Registrando..." : "Registrar pago")}
          </button>

          {!canPay && (
            <div className="note">Completa los datos requeridos para continuar.</div>
          )}

          <div className="mini-legal">
            Demo frontend. No se procesa ningún cobro real.
          </div>

          <div className="next-links">
            ¿Quieres ver tus pagos? <Link to="/historial">Ir al historial</Link>
          </div>
        </aside>
      </form>
    </div>
  );
}
