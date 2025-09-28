import React, { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import BackToMenu from "../../Componentes/backtoMenu";
import "../../Styles/pagos.css";
import { addPayment } from "../../Data/Stores/pagos.store";

/* ======= Datos de ejemplo ======= */
const PLANS = [
  { id: "black", name: "Plan Black", price: 29.9 },
  { id: "fit",   name: "Plan Fit",   price: 21.9 },
  { id: "smart", name: "Plan Smart", price: 25.9 },
];
const TAX_RATE = 0.12;
const COUPONS = { BIENVENIDA10: 0.10, GYM5: 0.05 };
const PAY_KEY = "demo_pagos";

/* ======= Utilidades ======= */
const money = (n) => n.toLocaleString("es-EC", { style: "currency", currency: "USD" });
const onlyDigits = (s) => s.replace(/\D+/g, "");
const hasOnlyDigitsAndSpaces = (s) => /^[\d\s]*$/.test(s);
// HINT: ejemplo clásico (no obligatorio para pagar)
const EXAMPLE_CARD = "4111 1111 1111 1111";

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

  // XXXX XXXX XXXX ....
  const formatCardNumber = (v) =>
    onlyDigits(v).slice(0, 19).replace(/(\d{4})(?=\d)/g, "$1 ");

  // validaciones base
  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const nameOk = name.trim().length >= 2;

  // VALIDACIONES TARJETA (sin Luhn, pero con reglas sólidas)
  const cardNumOnlyDigits = hasOnlyDigitsAndSpaces(cardNumber);
  const cardDigitsCount = onlyDigits(cardNumber).length;
  const cardNumLengthOk = cardDigitsCount >= 13 && cardDigitsCount <= 19;

  // Solo letras para el nombre en tarjeta (con tildes/ñ)
  const cardNameOnlyLetters = /^[A-Za-zÁÉÍÓÚÜáéíóúüÑñ\s]*$/.test(cardName);

  const expOk =
    /^\d{2}$/.test(expMonth) &&
    /^\d{2}$/.test(expYear) &&
    Number(expMonth) >= 1 &&
    Number(expMonth) <= 12 &&
    isFuture(expMonth, expYear);

  const cvvOk = /^\d{3,4}$/.test(cvv);

  const cardOk =
    method !== "card" || (
      cardName.trim().length >= 2 &&
      cardNameOnlyLetters &&
      cardNumOnlyDigits &&
      cardNumLengthOk &&
      expOk &&
      cvvOk
    );

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
      planId,
      subtotal,
      discount,
      tax,
      total,
      method,
      name,
      email,
      last4: method === "card" ? onlyDigits(cardNumber).slice(-4) : null,
    };

    try {
      // Historial (localStorage)
      const prev = JSON.parse(localStorage.getItem(PAY_KEY) || "[]");
      prev.unshift(receipt);
      localStorage.setItem(PAY_KEY, JSON.stringify(prev));

      // Store (para Reportes)
      await addPayment({
        userId: email || name || "anon",
        planId,
        total,
        method,
      });

      setSuccess({ id: receipt.id, total: receipt.total, plan: receipt.plan });
      // Si quieres ir directo:
      // navigate("/admin/reportes");
    } catch (err) {
      console.error("No se pudo registrar el pago:", err);
      alert("Hubo un problema registrando el pago. Inténtalo nuevamente.");
    } finally {
      setCardNumber("");
      setCvv("");
      setSubmitting(false);
    }
  }

  return (
    <div className="pay-page">
      {/* Top */}
      <div className="pay-top">
        <BackToMenu />
        <h1 className="title">Pagos</h1>
      </div>

      {/* Mensaje de éxito */}
      {success && (
        <div className="success-box" role="status" aria-live="polite">
          <div className="sb-title">Pago registrado correctamente</div>
          <div className="sb-body">
            Comprobante: <strong>{success.id}</strong> · Plan: <strong>{success.plan}</strong> · Total: <strong>{money(success.total)}</strong>
          </div>
          <div className="sb-actions">
            <Link className="btn outline" to="/historial">Ver historial</Link>
            <button className="btn outline" onClick={() => navigate("/admin/reportes")}>
              Ver reportes
            </button>
            <button className="btn link" onClick={()=>setSuccess(null)}>Cerrar</button>
          </div>
        </div>
      )}

      <form className="grid" onSubmit={handlePay}>
        {/* Izquierda */}
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
                aria-invalid={!nameOk && name.length > 0}
              />
              {!nameOk && name.length > 0 && <small className="err">Ingresa al menos 2 caracteres.</small>}
            </div>
            <div>
              <label>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ana@example.com"
                required
                aria-invalid={!emailOk && email.length > 0}
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
                  aria-invalid={(cardName.length > 0 && (!cardNameOnlyLetters || cardName.trim().length < 2))}
                />
                {cardName && !cardNameOnlyLetters && <small className="err">Ingrese solo letras</small>}
                {cardName && cardNameOnlyLetters && cardName.trim().length < 2 && <small className="err">Ingresa al menos 2 caracteres.</small>}
              </div>

              <div className="row two">
                <div>
                  <label>Número</label>
                  <input
                    inputMode="numeric"
                    pattern="[\d\s]*"
                    title="Ingrese solo números"
                    value={cardNumber}
                    onChange={(e) => {
                      const v = e.target.value;
                      if (!hasOnlyDigitsAndSpaces(v)) {
                        setCardNumber(v); // muestra tal cual para ver el error
                      } else {
                        setCardNumber(formatCardNumber(v));
                      }
                    }}
                    placeholder={EXAMPLE_CARD}
                    maxLength={22}
                    required
                    aria-invalid={(!cardNumOnlyDigits || !cardNumLengthOk) && cardNumber.length > 0}
                  />
                  {!cardNumOnlyDigits && <small className="err">Ingrese solo números</small>}
                  {cardNumOnlyDigits && !cardNumLengthOk && cardNumber && (
                    <small className="err">El número debe tener entre 13 y 19 dígitos</small>
                  )}
                  {/* Aviso solo informativo */}
                  {cardNumOnlyDigits && cardNumLengthOk && (
                    <small className="hint">Ejemplo válido: {EXAMPLE_CARD}</small>
                  )}
                </div>

                <div className="two">
                  <div>
                    <label>MM</label>
                    <input
                      inputMode="numeric"
                      pattern="\d*"
                      title="Ingrese solo números"
                      maxLength={2}
                      value={expMonth}
                      onChange={(e) => setExpMonth(onlyDigits(e.target.value).slice(0, 2))}
                      placeholder="MM"
                      required
                      aria-invalid={!/^\d{2}$/.test(expMonth) && expMonth.length > 0}
                    />
                    {expMonth && !/^\d{2}$/.test(expMonth) && <small className="err">Ingrese solo números</small>}
                  </div>
                  <div>
                    <label>YY</label>
                    <input
                      inputMode="numeric"
                      pattern="\d*"
                      title="Ingrese solo números"
                      maxLength={2}
                      value={expYear}
                      onChange={(e) => setExpYear(onlyDigits(e.target.value).slice(0, 2))}
                      placeholder="YY"
                      required
                      aria-invalid={!/^\d{2}$/.test(expYear) && expYear.length > 0}
                    />
                    {expYear && !/^\d{2}$/.test(expYear) && <small className="err">Ingrese solo números</small>}
                  </div>
                  <div>
                    <label>CVV</label>
                    <input
                      inputMode="numeric"
                      pattern="\d*"
                      title="Ingrese solo números"
                      maxLength={4}
                      value={cvv}
                      onChange={(e) => setCvv(onlyDigits(e.target.value).slice(0, 4))}
                      placeholder="***"
                      required
                      aria-invalid={!/^\d{3,4}$/.test(cvv) && cvv.length > 0}
                    />
                    {cvv && !/^\d{3,4}$/.test(cvv) && <small className="err">Ingrese solo números (3–4 dígitos)</small>}
                  </div>
                </div>
              </div>

              {!expOk && expMonth && expYear && (<small className="err">La tarjeta está vencida</small>)}
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

        {/* Derecha */}
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
            <div className="note">
              {(!nameOk || !emailOk) && <div>Completa nombre y email válidos.</div>}
              {method === "card" && (
                <>
                  {cardName && !cardNameOnlyLetters && <div>Nombre en la tarjeta: solo letras.</div>}
                  {cardNumber && !cardNumOnlyDigits && <div>Número de tarjeta: solo números.</div>}
                  {cardNumber && cardNumOnlyDigits && !cardNumLengthOk && <div>La tarjeta debe tener entre 13 y 19 dígitos.</div>}
                  {!expOk && (expMonth || expYear) && <div>Revisa MM/YY (debe ser a futuro).</div>}
                  {cvv && !cvvOk && <div>CVV inválido (3–4 dígitos).</div>}
                </>
              )}
            </div>
          )}

          <div className="mini-legal">Demo frontend. No se procesa ningún cobro real.</div>

          <div className="next-links">
            ¿Quieres ver tus pagos? <Link to="/historial">Ir al historial</Link>
          </div>
        </aside>
      </form>
    </div>
  );
}
