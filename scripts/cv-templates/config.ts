export interface TemplateConfig {
  font: string;
  bodySize: string;
  nameSize: string;
  headingSize: string;
  colorText: string;
  colorAccent: string;
  colorSidebarBg: string;
  marginTop: string;
  marginBottom: string;
  marginSide: string;
  photoPath: string | null;
}

export const techConfig: TemplateConfig = {
  font: "Inter, Roboto, system-ui, sans-serif",
  bodySize: "9.5pt",
  nameSize: "14pt",
  headingSize: "11pt",
  colorText: "#333333",
  colorAccent: "#2563eb",
  colorSidebarBg: "transparent",
  marginTop: "20mm",
  marginBottom: "20mm",
  marginSide: "18mm",
  photoPath: null,
};

export const lebenslaufConfig: TemplateConfig = {
  font: "Inter, Roboto, system-ui, sans-serif",
  bodySize: "9.5pt",
  nameSize: "14pt",
  headingSize: "11pt",
  colorText: "#333333",
  colorAccent: "#2563eb",
  colorSidebarBg: "#f8f9fa",
  marginTop: "15mm",
  marginBottom: "15mm",
  marginSide: "15mm",
  photoPath: "scripts/photo.jpg",
};
