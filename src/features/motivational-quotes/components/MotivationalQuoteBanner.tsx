import { useAppTheme } from "@/theme/theme";
import { useEffect, useState } from "react";
import { Linking, Pressable, StyleSheet, Text, View } from "react-native";
import {
  getDailyQuote,
  type MotivationalQuote,
} from "../services/quote.service";

const ZENQUOTES_URL = "https://zenquotes.io/";

export function MotivationalQuoteBanner() {
  const { colors } = useAppTheme();
  const [quote, setQuote] = useState<MotivationalQuote | null>(null);

  useEffect(() => {
    let active = true;
    void getDailyQuote().then((result) => {
      if (active) setQuote(result);
    });
    return () => {
      active = false;
    };
  }, []);

  return (
    <View style={[styles.banner, { backgroundColor: colors.primarySoft }]}>
      <View style={styles.header}>
        <Text style={[styles.eyebrow, { color: colors.primary }]}>
          DAILY INSPIRATION
        </Text>
        <Text style={[styles.mark, { color: colors.primary }]}>“</Text>
      </View>
      <Text style={[styles.quote, { color: colors.text }]}>
        {quote?.quote ?? "Finding today’s inspiration…"}
      </Text>
      {quote ? (
        <Text style={[styles.author, { color: colors.textMuted }]}>
          — {quote.author}
        </Text>
      ) : null}
      <Pressable
        accessibilityRole="link"
        onPress={() => void Linking.openURL(ZENQUOTES_URL)}
        hitSlop={8}
      >
        <Text style={[styles.credit, { color: colors.primary }]}>
          Quotes by ZenQuotes
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: { marginTop: 10, borderRadius: 24, padding: 22, marginBottom: 30 },
  header: { flexDirection: "row", justifyContent: "space-between" },
  eyebrow: { fontSize: 11, fontWeight: "800", letterSpacing: 1.2 },
  mark: { fontSize: 38, lineHeight: 32, fontWeight: "700", opacity: 0.45 },
  quote: { fontSize: 22, lineHeight: 29, fontWeight: "700", marginTop: 8 },
  author: { fontSize: 13, fontWeight: "600", marginTop: 12 },
  credit: { fontSize: 10, fontWeight: "700", marginTop: 18 },
});
