import React, { useMemo, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  CreditCard, 
  Building2, 
  Banknote, 
  Shield, 
  Check, 
  AlertCircle, 
  Lock,
  Receipt,
  Gift,
  ArrowLeft,
  User,
  Mail,
  Calendar,
  Hash
} from "lucide-react";
import { paymentsService } from "../../Data/Services/membershipService";
import { useNotifications } from "../../hooks/useNotifications";
import "../../Styles/pagos.css";

// Datos de ejemplo
const PLANS = [
  { id: "black", name: "Plan Black", price: 29.9 },
  { id: "fit", name: "Plan Fit", price: 21.9 },
  { id: "smart", name: "Plan Smart", price: 25.9 },
];

const TAX_RATE = 0.12; // IVA 12%
const COUPONS = {
  BIENVENIDA10: 0.10, // 10% off
  GYM5: 0.05
};

// Utilidades
const money = (n) => n.toLocaleString("es-EC", { style: "currency", currency: "USD" });
const onlyDigits = (s) => s.replace(/\D+/g, "");

// Luhn (verificación básica de tarjeta)
function luhnCheck(num) {
  const s = onlyDigits(num);
  let sum = 0;
  let alt = false;
  for (let i = s.length - 1; i >= 0; i--) {
    let n = parseInt(s[i], 10);
    if (alt) { 
      n *= 2; 
      if (n > 9) n -= 9; 
    }
    sum += n; 
    alt = !alt;
  }
  return (sum % 10) === 0 && s.length >= 13 && s.length <= 19;
}

function isFuture(mm, yy) {
  const m = Number(mm);
  const y = Number("20" + yy);
  if (!m || !y) return false;
  const now = new Date();
  const exp = new Date(y, m, 0);
  return exp >= new Date(now.getFullYear(), now.getMonth(), 1);
}

export default function Pagos() {
  const navigate = useNavigate();
  const { showSuccess, showError } = useNotifications();

  // Estado general
  const [planId, setPlanId] = useState(PLANS[0].id);
  const [coupon, setCoupon] = useState("");
  const [method, setMethod] = useState("card");
  const [checkoutData, setCheckoutData] = useState(null);

  // Datos del cliente
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  // Tarjeta
  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expMonth, setExpMonth] = useState("");
  const [expYear, setExpYear] = useState("");
  const [cvv, setCvv] = useState("");

  // UI
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(null);

  // Cargar datos de checkout si vienen desde la galería de planes
  useEffect(() => {
    const savedCheckoutData = localStorage.getItem('checkout_data');
    if (savedCheckoutData) {
      try {
        const data = JSON.parse(savedCheckoutData);
        setCheckoutData(data);
        if (data.subscription) {
          setPlanId(data.subscription.planId);
        }
        localStorage.removeItem('checkout_data');
      } catch (error) {
        console.error('Error loading checkout data:', error);
      }
    }
  }, []);

  const plan = PLANS.find((p) => p.id === planId);

  const discountRate = useMemo(() => {
    const code = coupon.trim().toUpperCase();
    return COUPONS[code] || 0;
  }, [coupon]);

  // Usar precios del checkout si están disponibles
  const subtotal = checkoutData?.pricing?.totalMonthly || plan.price;
  const discount = checkoutData?.pricing?.savings || (subtotal * discountRate);
  const taxedBase = Math.max(0, subtotal - discount);
  const tax = taxedBase * TAX_RATE;
  const total = taxedBase + tax;

  // Formateo de número de tarjeta
  const formatCardNumber = (v) =>
    onlyDigits(v).slice(0, 19).replace(/(\d{4})(?=\d)/g, "$1 ");

  async function handlePay(e) {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    setSuccess(null);

    try {
      // Preparar datos del pago para el servicio
      const paymentData = {
        amount: total,
        method,
        planId: plan.id,
        planName: plan.name,
        customerName: name,
        customerEmail: email,
        metadata: {
          subtotal,
          discount,
          tax,
          coupon: coupon || null,
          last4: method === "card" ? onlyDigits(cardNumber).slice(-4) : null
        }
      };

      // Procesar pago a través del servicio
      const response = await paymentsService.processPayment(paymentData);

      if (response.success) {
        setCardNumber("");
        setCvv("");

        setSuccess({
          id: response.data.receipt,
          total: response.data.amount,
          plan: response.data.planName,
          transactionId: response.data.transactionId
        });

        showSuccess(`💳 Pago procesado exitosamente - ${response.data.receipt}`);

        setTimeout(() => {
          navigate('/cliente/historial');
        }, 3000);
      } else {
        throw new Error(response.message || 'Error al procesar el pago');
      }
    } catch (error) {
      console.error('Error processing payment:', error);
      showError('❌ Error al procesar el pago. Por favor, inténtalo de nuevo.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="payments-container">
      {/* Header profesional */}
      <div className="payments-header">
        <div className="header-content">
          <button 
            type="button" 
            className="back-button"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="back-icon" />
          </button>
          <div className="header-info">
            <h1 className="page-title">
              <CreditCard className="title-icon" />
              Procesamiento de Pago
            </h1>
            <p className="page-subtitle">Completa tu suscripción de forma segura</p>
          </div>
          <div className="security-badge">
            <Shield className="security-icon" />
            <span>Pago Seguro</span>
          </div>
        </div>
      </div>

      {/* Mensaje de éxito moderno */}
      {success && (
        <div className="success-notification">
          <div className="success-content">
            <div className="success-icon-wrapper">
              <Check className="success-icon" />
            </div>
            <div className="success-info">
              <h3>¡Pago Procesado Exitosamente!</h3>
              <div className="success-details">
                <span><Receipt className="detail-icon" />Comprobante: <strong>{success.id}</strong></span>
                <span><Gift className="detail-icon" />Plan: <strong>{success.plan}</strong></span>
                <span><Hash className="detail-icon" />Total: <strong>{money(success.total)}</strong></span>
              </div>
            </div>
            <div className="success-actions">
              <Link className="btn-success primary" to="/cliente/historial">
                <Receipt className="btn-icon" />
                Ver Historial
              </Link>
              <button className="btn-success secondary" onClick={() => setSuccess(null)}>
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="payments-layout">
        {/* Panel principal */}
        <form className="payment-form" onSubmit={handlePay}>
          {/* Información del cliente */}
          <section className="form-section">
            <div className="section-header">
              <User className="section-icon" />
              <h2>Información del Cliente</h2>
            </div>
            
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="customer-name">
                  <User className="label-icon" />
                  Nombre y Apellido
                </label>
                <input
                  id="customer-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ej. Ana López"
                  className="form-input"
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="customer-email">
                  <Mail className="label-icon" />
                  Email
                </label>
                <input
                  id="customer-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ana@ejemplo.com"
                  className="form-input"
                  required
                />
              </div>
            </div>
          </section>

          {/* Selección de plan */}
          <section className="form-section">
            <div className="section-header">
              <Gift className="section-icon" />
              <h2>Plan Seleccionado</h2>
            </div>
            
            <div className="plan-selector">
              {PLANS.map((p) => (
                <div 
                  key={p.id} 
                  className={`plan-option ${planId === p.id ? 'selected' : ''}`}
                  onClick={() => setPlanId(p.id)}
                >
                  <div className="plan-info">
                    <span className="plan-name">{p.name}</span>
                    <span className="plan-price">{money(p.price)}/mes</span>
                  </div>
                  {planId === p.id && <Check className="check-icon" />}
                </div>
              ))}
            </div>

            {/* Cupón de descuento */}
            <div className="coupon-section">
              <div className="form-group">
                <label htmlFor="coupon-code">
                  <Gift className="label-icon" />
                  Código de Descuento (Opcional)
                </label>
                <input
                  id="coupon-code"
                  type="text"
                  value={coupon}
                  onChange={(e) => setCoupon(e.target.value.toUpperCase())}
                  placeholder="BIENVENIDA10"
                  className="form-input"
                />
                {discountRate > 0 && (
                  <small className="discount-applied">
                    <Check className="check-icon" />
                    ¡Descuento del {(discountRate * 100).toFixed(0)}% aplicado!
                  </small>
                )}
              </div>
            </div>
          </section>

          {/* Método de pago */}
          <section className="form-section">
            <div className="section-header">
              <CreditCard className="section-icon" />
              <h2>Método de Pago</h2>
            </div>
            
            <div className="payment-methods">
              <button 
                type="button" 
                className={`payment-method ${method === "card" ? "active" : ""}`}
                onClick={() => setMethod("card")}
              >
                <CreditCard className="method-icon" />
                <span>Tarjeta de Crédito/Débito</span>
                {method === "card" && <Check className="check-icon" />}
              </button>
              
              <button 
                type="button" 
                className={`payment-method ${method === "transfer" ? "active" : ""}`}
                onClick={() => setMethod("transfer")}
              >
                <Building2 className="method-icon" />
                <span>Transferencia Bancaria</span>
                {method === "transfer" && <Check className="check-icon" />}
              </button>
              
              <button 
                type="button" 
                className={`payment-method ${method === "cash" ? "active" : ""}`}
                onClick={() => setMethod("cash")}
              >
                <Banknote className="method-icon" />
                <span>Efectivo</span>
                {method === "cash" && <Check className="check-icon" />}
              </button>
            </div>

            {/* Formulario de tarjeta */}
            {method === "card" && (
              <div className="card-form">
                <div className="security-notice">
                  <Lock className="security-icon" />
                  <span>Tus datos están protegidos con encriptación SSL</span>
                </div>
                
                <div className="form-group">
                  <label htmlFor="card-name">
                    <User className="label-icon" />
                    Nombre en la Tarjeta
                  </label>
                  <input
                    id="card-name"
                    type="text"
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value)}
                    placeholder="Como aparece en la tarjeta"
                    className="form-input"
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="card-number">
                    <CreditCard className="label-icon" />
                    Número de Tarjeta
                  </label>
                  <input
                    id="card-number"
                    inputMode="numeric"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                    placeholder="1234 5678 9012 3456"
                    maxLength={22}
                    className={`form-input ${cardNumber && !luhnCheck(cardNumber) ? 'error' : ''}`}
                    required
                  />
                  {cardNumber && !luhnCheck(cardNumber) && (
                    <small className="error-message">
                      <AlertCircle className="error-icon" />
                      Número de tarjeta inválido
                    </small>
                  )}
                </div>
                
                <div className="form-grid">
                  <div className="form-group">
                    <label htmlFor="exp-month">
                      <Calendar className="label-icon" />
                      Mes
                    </label>
                    <input
                      id="exp-month"
                      inputMode="numeric"
                      maxLength={2}
                      value={expMonth}
                      onChange={(e) => setExpMonth(onlyDigits(e.target.value).slice(0, 2))}
                      placeholder="MM"
                      className="form-input"
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="exp-year">
                      <Calendar className="label-icon" />
                      Año
                    </label>
                    <input
                      id="exp-year"
                      inputMode="numeric"
                      maxLength={2}
                      value={expYear}
                      onChange={(e) => setExpYear(onlyDigits(e.target.value).slice(0, 2))}
                      placeholder="YY"
                      className="form-input"
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="cvv">
                      <Lock className="label-icon" />
                      CVV
                    </label>
                    <input
                      id="cvv"
                      inputMode="numeric"
                      maxLength={4}
                      value={cvv}
                      onChange={(e) => setCvv(onlyDigits(e.target.value).slice(0, 4))}
                      placeholder="123"
                      className="form-input"
                      required
                    />
                  </div>
                </div>
                
                {expMonth && expYear && !isFuture(expMonth, expYear) && (
                  <small className="error-message">
                    <AlertCircle className="error-icon" />
                    Fecha de vencimiento inválida
                  </small>
                )}
              </div>
            )}

            {/* Información para transferencia */}
            {method === "transfer" && (
              <div className="transfer-info">
                <div className="info-card">
                  <Building2 className="info-icon" />
                  <div className="bank-details">
                    <h4>Datos para Transferencia</h4>
                    <p><strong>Banco:</strong> Banco Pichincha</p>
                    <p><strong>Cuenta:</strong> 1234567890</p>
                    <p><strong>Beneficiario:</strong> Apolo Gym S.A.</p>
                    <p><strong>Concepto:</strong> Suscripción {plan.name}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Información para efectivo */}
            {method === "cash" && (
              <div className="cash-info">
                <div className="info-card">
                  <Banknote className="info-icon" />
                  <div className="cash-details">
                    <h4>Pago en Efectivo</h4>
                    <p>Acércate a nuestra recepción con el comprobante de esta compra.</p>
                    <p><strong>Horarios:</strong> Lunes a Domingo 6:00 AM - 10:00 PM</p>
                  </div>
                </div>
              </div>
            )}
          </section>

          {/* Botón de pago */}
          <button 
            type="submit" 
            disabled={submitting || !name || !email || (method === "card" && (!cardNumber || !luhnCheck(cardNumber) || !expMonth || !expYear || !cvv || !isFuture(expMonth, expYear)))}
            className="submit-button"
          >
            {submitting ? (
              <>
                <div className="spinner"></div>
                Procesando...
              </>
            ) : (
              <>
                <Lock className="btn-icon" />
                Pagar {money(total)}
              </>
            )}
          </button>
        </form>

        {/* Panel de resumen */}
        <aside className="payment-summary">
          <div className="summary-card">
            <h3 className="summary-title">
              <Receipt className="summary-icon" />
              Resumen del Pedido
            </h3>
            
            <div className="summary-content">
              <div className="plan-summary">
                <div className="plan-details">
                  <span className="plan-name">
                    {checkoutData?.subscription?.planName || plan.name}
                  </span>
                  {checkoutData?.membershipTypeInfo && (
                    <span className="membership-type">
                      {checkoutData.membershipTypeInfo.label} - {checkoutData.subscription.billingCycle === 'annual' ? 'Anual' : 'Mensual'}
                    </span>
                  )}
                </div>
                <span className="plan-price">{money(subtotal)}</span>
              </div>
              
              {/* Mostrar add-ons si los hay */}
              {checkoutData?.subscription?.addons && checkoutData.subscription.addons.length > 0 && (
                <div className="addons-section">
                  <h4 className="addons-title">Servicios Adicionales</h4>
                  {checkoutData.subscription.addons.map((addon) => (
                    <div key={addon.id} className="addon-line">
                      <span className="addon-name">{addon.name}</span>
                      <span className="addon-price">{money(addon.price)}</span>
                    </div>
                  ))}
                </div>
              )}

              {discount > 0 && (
                <div className="discount-line">
                  <span className="discount-label">
                    <Gift className="discount-icon" />
                    Descuento {checkoutData?.subscription?.billingCycle === 'annual' ? '(Plan Anual)' : ''}
                  </span>
                  <span className="discount-amount">-{money(discount)}</span>
                </div>
              )}
              
              <div className="tax-line">
                <span>IVA (12%)</span>
                <span>{money(tax)}</span>
              </div>
              
              <div className="total-line">
                <span>Total</span>
                <span className="total-amount">{money(total)}</span>
              </div>
            </div>
            
           
          </div>
        </aside>
      </div>
    </div>
  );
}