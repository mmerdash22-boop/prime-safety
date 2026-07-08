export const PAYMENT_METHODS = [
  { label: "نقدًا", note: "" },
  { label: "تحويل بنكي", note: "" },
  { label: "إنستاباي", note: "01228614557" },
  { label: "فودافون كاش", note: "01030486577" },
  { label: "شيك", note: "" },
  { label: "أخرى", note: "" },
];
export const paymentNote = (label) => PAYMENT_METHODS.find((p) => p.label === label)?.note || "";

export const todayISO = () => new Date().toISOString().slice(0, 10);

export const money = (n) =>
  (Number(n) || 0).toLocaleString("ar-EG", { maximumFractionDigits: 0 }) + " ج.م";

export const certLabel = (row, courses) => {
  if (row.certificate_code === "OTHER") return row.certificate_custom || "شهادة أخرى";
  const c = courses?.find((c) => c.id === row.certificate_code);
  return c ? c.title : row.certificate_code;
};

export function compressImage(file, maxDim = 900, quality = 0.68) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let { width, height } = img;
        if (width > height) {
          if (width > maxDim) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          }
        } else if (height > maxDim) {
          width = Math.round((width * maxDim) / height);
          height = maxDim;
        }
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx.fillStyle = "#fff";
        ctx.fillRect(0, 0, width, height);
        ctx.drawImage(img, 0, 0, width, height);
        canvas.toBlob((blob) => resolve(blob), "image/jpeg", quality);
      };
      img.onerror = reject;
      img.src = e.target.result;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
