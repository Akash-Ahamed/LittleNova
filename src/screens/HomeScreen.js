import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  useWindowDimensions,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { SECTIONS } from "../data/numbers/NumbersSections";

export default function LearningTrackWireframe() {
  const navigation = useNavigation();
  const { width } = useWindowDimensions();

  const cardWidth = width * 0.4;
  const cardHeight = 130;

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.screen}>
        {/* Top Bar */}
        <View style={styles.topBar}>
          <View style={styles.profileBox}>
            <View style={styles.circle} />
            <View>
              <Text style={styles.smallText}>Profile</Text>
            </View>
          </View>

          <View style={styles.topActions}>
            <TouchableOpacity style={styles.pillButton}>
              <Text style={styles.smallText}>For parents</Text>
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.verticalContent}
        >
          {SECTIONS.map((section) => (
            <View key={section.title} style={styles.section}>
              <Text style={styles.sectionTitle}>{section.title}</Text>

              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.cardsRow}
              >
                {section.data.map((item) => (
                  <TouchableOpacity
                    key={item.id}
                    activeOpacity={0.85}
                    style={[
                      styles.activityCard,
                      {
                        width: cardWidth,
                        height: cardHeight,
                      },
                    ]}
                    onPress={() => {
                      if (item.title === "Count Objects") {
                        navigation.navigate("CountObjects");
                      }
                    }}
                  >
                    <Text style={styles.cardText}>{item.title}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          ))}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F8FAFF",
  },
  screen: {
    flex: 1,
    backgroundColor: "#F8FAFF",
    padding: 16,
  },
  verticalContent: {
    paddingBottom: 24,
    gap: 24,
  },
  section: {
    width: "100%",
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#12384A",
    marginBottom: 12,
  },
  cardsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 18,
    paddingRight: 20,
  },
  activityCard: {
    borderWidth: 1.5,
    borderColor: "#12384A",
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F8FAFF",
  },
  cardText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#12384A",
    textAlign: "center",
  },

  topBar: {
    borderColor: "#72ccf6",

    borderRadius: 24,
    paddingHorizontal: 10,
    paddingVertical: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  profileBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  circle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1.5,
    borderColor: "#12384A",
  },
  topActions: {
    flexDirection: "row",
    gap: 10,
  },
  pillButton: {
    borderWidth: 1.5,
    borderColor: "#12384A",
    borderRadius: 18,
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
});
