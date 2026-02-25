import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

interface OrderItem {
  menuItemId: {
    name: string;
    price: number;
  } | null;
  quantity: number;
}

interface Order {
  _id: string;
  items: OrderItem[];
  customerName: string;
  address: string;
  phone: string;
  paymentMethod: string;
  createdAt: string;
  status: string;
}

// GST rate (5% for food items)
const GST_RATE = 0.05;
// Example GSTIN (you can replace with your actual GSTIN)
const GSTIN = "22AAAAA0000A1Z5";

export const generateOrderPDF = (order: Order) => {
  const doc = new jsPDF();

  // ==================== COMPANY HEADER ====================
  doc.setFillColor(41, 128, 185);
  doc.rect(0, 0, 210, 35, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(22);
  doc.setFont("helvetica", "bold");
  doc.text("FEASTFLOW", 14, 18);

  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.text("Gourmet Food Delivery", 14, 25);
  doc.text(`GSTIN: ${GSTIN}`, 14, 30);
  doc.text("invoice@feastflow.com | +1 234 567 890", 120, 18);
  doc.text("123 Food Street, Culinary City", 120, 25);

  // ==================== INVOICE TITLE ====================
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.text("TAX INVOICE", 14, 50);

  doc.setDrawColor(200, 200, 200);
  doc.line(14, 53, 196, 53);

  // ==================== INVOICE DETAILS ====================
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.text("Invoice Number:", 14, 63);
  doc.text("Invoice Date:", 14, 69);
  doc.text("Payment Method:", 14, 75);
  doc.text("Order Status:", 14, 81);

  doc.setFont("helvetica", "normal");
  doc.text(`INV-${order._id.slice(-8).toUpperCase()}`, 58, 63);
  doc.text(
    new Date(order.createdAt).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }),
    58,
    69
  );
  doc.text(
    order.paymentMethod === "cash"
      ? "Cash on Delivery"
      : order.paymentMethod.toUpperCase(),
    58,
    75
  );
  doc.text(order.status.replace("_", " ").toUpperCase(), 58, 81);

  // ==================== CUSTOMER DETAILS ====================
  doc.setFont("helvetica", "bold");
  doc.text("Bill To:", 140, 63);
  doc.setFont("helvetica", "normal");
  doc.text(order.customerName, 140, 69);
  doc.text(order.address, 140, 75);
  doc.text(`Phone: ${order.phone}`, 140, 81);

  // ==================== ITEMS TABLE ====================
  const tableColumn = ["#", "Item", "Quantity", "Unit Price", "Total"];
  const tableRows = order.items.map((item, index) => {
    const name = item.menuItemId?.name || "Unknown Item";
    const price = item.menuItemId?.price || 0;
    const quantity = item.quantity;
    const total = price * quantity;
    return [
      index + 1,
      name,
      quantity.toString(),
      `$${price.toFixed(2)}`,
      `$${total.toFixed(2)}`,
    ];
  });

  autoTable(doc, {
    startY: 95,
    head: [tableColumn],
    body: tableRows,
    theme: "grid",
    headStyles: {
      fillColor: [41, 128, 185],
      textColor: 255,
      fontStyle: "bold",
      halign: "center",
    },
    columnStyles: {
      0: { cellWidth: 15, halign: "center" },
      1: { cellWidth: "auto" },
      2: { cellWidth: 25, halign: "center" },
      3: { cellWidth: 30, halign: "right" },
      4: { cellWidth: 30, halign: "right" },
    },
    margin: { left: 14, right: 14 },
  });

  // ==================== TOTALS WITH GST ====================
  const finalY = (doc as any).lastAutoTable.finalY + 10;
  const subtotal = order.items.reduce(
    (sum, item) => sum + (item.menuItemId?.price || 0) * item.quantity,
    0
  );
  const gst = subtotal * GST_RATE;
  const grandTotal = subtotal + gst;

  // Draw a light background for totals
  doc.setFillColor(245, 245, 245);
  doc.rect(120, finalY - 2, 70, 38, "F");

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text("Subtotal:", 130, finalY + 2);
  doc.text(`$${subtotal.toFixed(2)}`, 175, finalY + 2, { align: "right" });

  doc.text(`GST (${GST_RATE * 100}%):`, 130, finalY + 8);
  doc.text(`$${gst.toFixed(2)}`, 175, finalY + 8, { align: "right" });

  doc.setFont("helvetica", "bold");
  doc.text("GRAND TOTAL:", 130, finalY + 18);
  doc.text(`$${grandTotal.toFixed(2)}`, 175, finalY + 18, { align: "right" });

  // ==================== FOOTER ====================
  doc.setDrawColor(41, 128, 185);
  doc.line(14, 270, 196, 270);

  doc.setFontSize(9);
  doc.setFont("helvetica", "italic");
  doc.setTextColor(100, 100, 100);
  doc.text(
    "Thank you for your order! Visit us again at www.feastflow.com",
    14,
    280
  );
  doc.text(
    "This is a computer generated invoice - no signature required.",
    14,
    285
  );

  // ==================== SAVE PDF ====================
  doc.save(`FeastFlow_Invoice_${order._id.slice(-6)}.pdf`);
};