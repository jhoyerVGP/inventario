import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";
import type { ReceiptData } from "@/types/receipt";

// Registro de fuente limpia y compacta para optimizar el espacio en tickets
Font.register({
  family: "Inter",
  src: "https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hjp-Ek-_EeA.ttf",
});

// Estilos optimizados para tiquetera térmica estándar de 80mm (226pt de ancho)
const styles = StyleSheet.create({
  page: {
    fontFamily: "Helvetica", // Cambiar a 'Inter' si se prefiere una fuente externa
    fontSize: 9,
    lineHeight: 1.2,
    paddingTop: 12,
    paddingLeft: 10,
    paddingRight: 10,
    paddingBottom: 15,
    flexDirection: "column",
    backgroundColor: "#ffffff",
  },
  // Contenedor del Isotipo / Logo Simple texturizado
  logoContainer: {
    alignItems: "center",
    marginBottom: 6,
  },
  logoBox: {
    borderWidth: 2,
    borderColor: "#000000",
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginBottom: 4,
  },
  logoText: {
    fontSize: 14,
    fontFamily: "Helvetica-Bold",
    letterSpacing: 2,
    textTransform: "uppercase",
  },
  // Bloque de encabezado principal
  companyHeader: {
    alignItems: "center",
    marginBottom: 10,
  },
  companyName: {
    fontSize: 11,
    fontFamily: "Helvetica-Bold",
    textTransform: "uppercase",
    textAlign: "center",
  },
  companyDetails: {
    fontSize: 8,
    color: "#333333",
    textAlign: "center",
    marginTop: 1,
  },
  // Divisores emulando el corte de tiquetera
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: "#000000",
    borderStyle: "dashed",
    marginVertical: 6,
  },
  thickDivider: {
    borderBottomWidth: 1.5,
    borderBottomColor: "#000000",
    marginVertical: 6,
  },
  // Metadatos de la transacción
  metaSection: {
    marginBottom: 6,
  },
  metaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    fontSize: 8.5,
    marginBottom: 2,
  },
  metaLabel: {
    color: "#555555",
  },
  metaValue: {
    fontFamily: "Helvetica-Bold",
  },
  // Datos del Cliente
  clientSection: {
    marginVertical: 4,
  },
  clientTitle: {
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    color: "#444444",
    marginBottom: 2,
  },
  clientText: {
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
  },
  // Lista de Productos (Estructura compacta POS)
  itemsHeader: {
    flexDirection: "row",
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    paddingBottom: 4,
  },
  itemRow: {
    flexDirection: "column",
    marginBottom: 5,
  },
  itemMainLine: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  itemName: {
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    width: "70%",
  },
  itemTotal: {
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    textAlign: "right",
    width: "30%",
  },
  itemSubDetails: {
    flexDirection: "row",
    fontSize: 8,
    color: "#444444",
    marginTop: 1,
  },
  // Bloque de Liquidación Financiera
  totalsSection: {
    alignItems: "flex-end",
    marginTop: 4,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    fontSize: 9,
    marginBottom: 3,
  },
  finalTotalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    fontSize: 12,
    fontFamily: "Helvetica-Bold",
    borderTopWidth: 1,
    borderTopColor: "#000000",
    paddingTop: 4,
    marginTop: 2,
  },
  debtRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    fontSize: 8.5,
    color: "#000000",
    fontFamily: "Helvetica-Bold",
    marginTop: 3,
  },
  // Pie de página legal / promocional
  footer: {
    alignItems: "center",
    marginTop: 15,
  },
  footerTitle: {
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    marginBottom: 3,
    textTransform: "uppercase",
  },
  footerText: {
    fontSize: 7.5,
    color: "#444444",
    textAlign: "center",
    lineHeight: 1.3,
  },
});

interface Props {
  data: ReceiptData;
}

export const FormatReceipt = ({ data }: Props) => (
  <Document>
    {/* Definimos un ancho fijo de 226pt (80mm) y un alto largo de 600pt. 
      La tiquetera cortará el papel físicamente al terminar el contenido.
    */}
    <Page size={[226, 600]} style={styles.page}>
      {/* ── 1. LOGO CORPORATIVO MINIMALISTA ── */}
      <View style={styles.logoContainer}>
        <View style={styles.logoBox}>
          <Text style={styles.logoText}>Zero</Text>
        </View>
      </View>

      {/* ── 2. DATOS DE LA EMPRESA ── */}
      <View style={styles.companyHeader}>
        <Text style={styles.companyName}>Mi Empresa S.R.L.</Text>
        <Text style={styles.companyDetails}>
          Calle Comercio #123, Zona Central
        </Text>
        <Text style={styles.companyDetails}>La Paz - Bolivia</Text>
        <Text style={styles.companyDetails}>Teléfono: +591 600-12345</Text>
        <Text
          style={[
            styles.companyDetails,
            { fontFamily: "Helvetica-Bold", marginTop: 4 },
          ]}
        >
          NOTA DE VENTA
        </Text>
        <Text
          style={[styles.companyDetails, { fontSize: 7, color: "#555555" }]}
        >
          Documento no válido para crédito fiscal
        </Text>
      </View>

      <View style={styles.divider} />

      {/* ── 3. METADATOS DEL TICKET ── */}
      <View style={styles.metaSection}>
        <View style={styles.metaRow}>
          <Text style={styles.metaLabel}>Nro. Recibo:</Text>
          <Text style={styles.metaValue}>#{data.receiptNumber}</Text>
        </View>
        <View style={styles.metaRow}>
          <Text style={styles.metaLabel}>Fecha/Hora:</Text>
          <Text style={styles.metaValue}>
            {new Date(data.created_at).toLocaleDateString("es-BO")}{" "}
            {new Date(data.created_at).toLocaleTimeString("es-BO", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </Text>
        </View>
        <View style={styles.metaRow}>
          <Text style={styles.metaLabel}>Sucursal:</Text>
          <Text style={styles.metaValue}>{data.branchName || "Centro"}</Text>
        </View>
        <View style={styles.metaRow}>
          <Text style={styles.metaLabel}>Atendido por:</Text>
          <Text style={styles.metaValue}>{data.userName || "Cajero"}</Text>
        </View>
      </View>

      <View style={styles.divider} />

      {/* ── 4. DATOS DEL CLIENTE ── */}
      <View style={styles.clientSection}>
        <View style={styles.metaRow}>
          <Text style={styles.metaLabel}>Cliente:</Text>
          <Text style={styles.metaValue}>{data.clientName || "Consumidor Final"}</Text>
        </View>
        <View style={styles.metaRow}>
          <Text style={styles.metaLabel}>NIT / CI:</Text>
          <Text style={styles.metaValue}>{data.clientNit || "0"}</Text>
        </View>
      </View>

      <View style={styles.thickDivider} />

      {/* ── 5. LISTA DE ARTÍCULOS ── */}
      <View style={{ flexGrow: 1 }}>
        <View style={styles.itemsHeader}>
          <Text style={{ width: "70%" }}>DESCRIPCIÓN</Text>
          <Text style={{ width: "30%", textAlign: "right" }}>TOTAL</Text>
        </View>
        <View style={[styles.divider, { marginVertical: 2 }]} />

        {(data.items || []).map((item, index) => (
          <View key={index} style={styles.itemRow}>
            <div style={styles.itemMainLine}>
              <Text style={styles.itemName}>{item.name}</Text>
              <Text style={styles.itemTotal}>
                Bs. {(item.unitPrice * item.quantity).toFixed(2)}
              </Text>
            </div>
            {/* Detalles de cantidad y precio por debajo del nombre para evitar colisiones */}
            <View style={styles.itemSubDetails}>
              <Text>
                {item.quantity} ud. x Bs. {item.unitPrice.toFixed(2)}
              </Text>
            </View>
          </View>
        ))}
      </View>

      <View style={styles.thickDivider} />

      {/* ── 6. TOTALES Y LIQUIDACIÓN FINANCIERA ── */}
      <View style={styles.totalsSection}>
        <View style={styles.totalRow}>
          <Text style={{ color: "#444444" }}>Subtotal:</Text>
          <Text>Bs. {data.totalAmount.toFixed(2)}</Text>
        </View>

        {data.discountAmount! > 0 && (
          <View style={styles.totalRow}>
            <Text style={{ color: "#444444" }}>Descuento:</Text>
            <Text>-Bs. {data.discountAmount!.toFixed(2)}</Text>
          </View>
        )}

        <View style={styles.finalTotalRow}>
          <Text>TOTAL:</Text>
          <Text>Bs. {data.finalAmount.toFixed(2)}</Text>
        </View>

        {data.debtAmount! > 0 && (
          <View style={styles.debtRow}>
            <Text>SALDO PENDIENTE:</Text>
            <Text>Bs. {data.debtAmount!.toFixed(2)}</Text>
          </View>
        )}
      </View>

      <View style={styles.divider} />

      {/* ── 7. PIE DE PÁGINA (TÉRMINOS) ── */}
      <View style={styles.footer}>
        <Text style={styles.footerTitle}>¡Gracias por su compra!</Text>
        <Text style={styles.footerText}>
          Por favor, verifique sus productos antes de retirarse del
          establecimiento.
        </Text>
        <Text
          style={[
            styles.footerText,
            { marginTop: 4, fontFamily: "Helvetica-Bold" },
          ]}
        >
          Forma de Pago: {data.paymentMethod || "Efectivo"}
        </Text>
      </View>
    </Page>
  </Document>
);
