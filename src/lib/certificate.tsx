import fs from "fs";
import path from "path";
import {
  Document,
  Page,
  View,
  Text,
  Image,
  Font,
  StyleSheet,
  renderToBuffer,
} from "@react-pdf/renderer";

// ─── Assets (read once per server process) ───────────────────────────────────

function fileToDataUri(relPath: string, mime: string) {
  const buf = fs.readFileSync(path.join(process.cwd(), relPath));
  return `data:${mime};base64,${buf.toString("base64")}`;
}

const greatVibes = fileToDataUri(
  "src/assets/fonts/GreatVibes-Regular.ttf",
  "font/ttf"
);
const logo = fileToDataUri("public/logo.png", "image/png");
const logoMark = fileToDataUri("public/logo-mark.png", "image/png");

Font.register({ family: "GreatVibes", src: greatVibes });
// Never hyphenate names or titles on a certificate
Font.registerHyphenationCallback((word) => [word]);

// ─── Palette (brand) ─────────────────────────────────────────────────────────

const COLORS = {
  ink: "#211a52", // primary-900
  primary: "#4f3ddb", // primary-600
  primaryDark: "#352a8c", // primary-800
  accent: "#d96b04", // accent-600
  muted: "#5f5478", // neutral-600
  faint: "#a89fc2", // neutral-400
  hairline: "#e6e2f5", // neutral-200
  wash: "#fbfaff", // neutral-50
};

const styles = StyleSheet.create({
  page: {
    backgroundColor: "#ffffff",
    padding: 28,
    fontFamily: "Helvetica",
  },
  outerFrame: {
    flex: 1,
    borderWidth: 2.5,
    borderColor: COLORS.primaryDark,
    padding: 5,
  },
  innerFrame: {
    flex: 1,
    borderWidth: 1,
    borderColor: COLORS.accent,
    backgroundColor: "#ffffff",
    paddingVertical: 30,
    paddingHorizontal: 48,
    alignItems: "center",
    justifyContent: "space-between",
  },
  watermark: {
    position: "absolute",
    top: "36%",
    left: "33%",
    width: 260,
    opacity: 0.03,
  },
  logo: {
    height: 44,
    objectFit: "contain",
  },
  heading: {
    marginTop: 18,
    fontSize: 32,
    fontFamily: "Helvetica-Bold",
    color: COLORS.ink,
    letterSpacing: 9,
  },
  subheading: {
    marginTop: 7,
    fontSize: 11,
    color: COLORS.accent,
    letterSpacing: 5.5,
  },
  presentedTo: {
    marginTop: 22,
    fontSize: 10.5,
    color: COLORS.muted,
    letterSpacing: 1.5,
  },
  studentName: {
    marginTop: 8,
    fontFamily: "GreatVibes",
    fontSize: 46,
    color: COLORS.ink,
    textAlign: "center",
    maxWidth: 620,
  },
  nameRule: {
    marginTop: 4,
    width: 300,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.accent,
  },
  completing: {
    marginTop: 16,
    fontSize: 10.5,
    color: COLORS.muted,
    letterSpacing: 1.5,
  },
  courseTitle: {
    marginTop: 8,
    fontSize: 19,
    fontFamily: "Helvetica-Bold",
    color: COLORS.primaryDark,
    textAlign: "center",
    maxWidth: 640,
  },
  courseMeta: {
    marginTop: 8,
    fontSize: 9.5,
    color: COLORS.faint,
    letterSpacing: 0.8,
  },
  footerRow: {
    width: "100%",
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    marginTop: 26,
  },
  signBlock: {
    width: 190,
    alignItems: "center",
  },
  signScript: {
    fontFamily: "GreatVibes",
    fontSize: 22,
    color: COLORS.ink,
    marginBottom: 2,
  },
  signValue: {
    fontSize: 10.5,
    fontFamily: "Helvetica-Bold",
    color: COLORS.ink,
    marginBottom: 2,
  },
  signRule: {
    width: "100%",
    borderTopWidth: 1,
    borderTopColor: COLORS.faint,
    paddingTop: 5,
    alignItems: "center",
  },
  signLabel: {
    fontSize: 8.5,
    color: COLORS.muted,
    letterSpacing: 1,
  },
  seal: {
    width: 74,
    height: 74,
    borderRadius: 37,
    borderWidth: 2,
    borderColor: COLORS.primary,
    backgroundColor: COLORS.wash,
    alignItems: "center",
    justifyContent: "center",
  },
  sealInner: {
    width: 62,
    height: 62,
    borderRadius: 31,
    borderWidth: 1,
    borderColor: COLORS.accent,
    alignItems: "center",
    justifyContent: "center",
  },
  sealLogo: {
    width: 40,
    height: 40,
    objectFit: "contain",
  },
  certId: {
    marginTop: 18,
    fontSize: 8,
    color: COLORS.faint,
    letterSpacing: 1,
  },
});

export interface CertificateData {
  studentName: string;
  courseTitle: string;
  durationLabel: string;
  classCount: number;
  classHours: number;
  completionDate: string;
  certificateId: string;
  signerName: string | null;
  signerRole: string | null;
}

function CertificateDocument({ data }: { data: CertificateData }) {
  return (
    <Document
      title={`Certificate of Completion — ${data.studentName}`}
      author="Data Science Skills Academy"
      subject={data.courseTitle}
    >
      <Page size="A4" orientation="landscape" style={styles.page}>
        <View style={styles.outerFrame}>
          <View style={styles.innerFrame}>
            <Image src={logoMark} style={styles.watermark} fixed />

            {/* Header */}
            <View style={{ alignItems: "center" }}>
              <Image src={logo} style={styles.logo} />
              <Text style={styles.heading}>CERTIFICATE</Text>
              <Text style={styles.subheading}>OF COMPLETION</Text>
            </View>

            {/* Body */}
            <View style={{ alignItems: "center" }}>
              <Text style={styles.presentedTo}>
                THIS CERTIFICATE IS PROUDLY PRESENTED TO
              </Text>
              <Text style={styles.studentName}>{data.studentName}</Text>
              <View style={styles.nameRule} />
              <Text style={styles.completing}>
                FOR SUCCESSFULLY COMPLETING THE COURSE
              </Text>
              <Text style={styles.courseTitle}>{data.courseTitle}</Text>
              <Text style={styles.courseMeta}>
                {data.durationLabel}  ·  {data.classCount} Live Classes  ·{"  "}
                {data.classCount * data.classHours} Learning Hours  ·  Completed{" "}
                {data.completionDate}
              </Text>
            </View>

            {/* Footer */}
            <View style={{ width: "100%", alignItems: "center" }}>
              <View style={styles.footerRow}>
                <View style={styles.signBlock}>
                  <Text style={styles.signValue}>{data.completionDate}</Text>
                  <View style={styles.signRule}>
                    <Text style={styles.signLabel}>DATE OF ISSUE</Text>
                  </View>
                </View>

                <View style={styles.seal}>
                  <View style={styles.sealInner}>
                    <Image src={logoMark} style={styles.sealLogo} />
                  </View>
                </View>

                <View style={styles.signBlock}>
                  <Text style={styles.signScript}>
                    {data.signerName ?? "Data Science Skills Academy"}
                  </Text>
                  <View style={styles.signRule}>
                    <Text style={styles.signLabel}>
                      {(data.signerRole ?? "AUTHORIZED SIGNATURE").toUpperCase()}
                    </Text>
                  </View>
                </View>
              </View>

              <Text style={styles.certId}>
                CERTIFICATE ID: {data.certificateId}   ·   ISSUED BY DATA
                SCIENCE SKILLS ACADEMY
              </Text>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
}

export async function renderCertificatePdf(data: CertificateData) {
  return renderToBuffer(<CertificateDocument data={data} />);
}
