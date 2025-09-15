import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
} from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { SERVER_AJAX_URL, useRequests } from "@/hooks/useRequests";

// ---------- Categories data (păstrat) ----------
const categories = [
  { id: "music", label: "Music", icon: "musical-notes-outline" },
  { id: "business", label: "Business", icon: "briefcase-outline" },
  { id: "art", label: "Art", icon: "color-palette-outline" },
  { id: "health", label: "Health", icon: "medkit-outline" },
  { id: "party", label: "Party", icon: "wine-outline" },
  { id: "football", label: "Football", icon: "football-outline" },
  { id: "tennis", label: "Tennis", icon: "tennisball-outline" },
  { id: "construction", label: "Construct...", icon: "construct-outline" },
];

// ---------- Filter chips (păstrat UI) ----------
const filterChips = [
  "Within 10 km",
  "Tonight",
  "Sports",
  "Music",
  "Family",
  "This week",
];

// ---------- Tipuri pentru date ----------
type EventDTO = {
  id: number;
  userId: number;
  title: string;
  description: string;
  category: "Sport" | "Family" | "Music" | "Art" | "Health" | "Party" | "Business";
  startsAt: number;       // unix secunde
  durationMin: number;
  location: string;
  capacity: number | null;
  minAge: number | null;
  maxAge: number | null;
  audience: "All" | "Female" | "Male";
  privacy: "Public" | "Private";
  joinType: "Join directly" | "Request to join";
  createdAt: string;
};

type GridCardItem = {
  id: string;
  category: string;    // ex. "SPORT"
  title: string;
  time: string;        // ex. "6:00 PM"
  distance: string;    // momentan gol (nu avem din backend)
  image: string;       // placeholder
  badgeColor: string;  // în funcție de categorie
  current: number;     // placeholder (0 până ai participants)
  total: number;       // capacity sau 0 dacă unlimited
};

// ---------- helpers UI ----------
const categoryColor: Record<string, string> = {
  Sport: "#58cc02",
  Family: "#1cb0f6",
  Music: "#ff4b4b",
  Art: "#ff9600",
  Health: "#34C759",
  Party: "#ce82ff",
  Business: "#8E8E93",
};

const placeholderImg =
  "https://cdn-icons-png.flaticon.com/512/1974/1974848.png";

// ---------- Chip (păstrat) ----------
const Chip = ({ title, onPress }: { title: string; onPress?: () => void }) => (
  <TouchableOpacity style={styles.chip} onPress={onPress} activeOpacity={0.7}>
    <Text style={styles.chipText}>{title}</Text>
  </TouchableOpacity>
);

// ---------- Card (păstrat, doar tipul schimbat) ----------
const GridCard = ({ item }: { item: GridCardItem }) => (
  <TouchableOpacity
    style={styles.gridCard}
    activeOpacity={0.8}
    onPress={() => router.push(`/events/${item.id}` as any)}
  >
    <View style={[styles.badge, { backgroundColor: item.badgeColor }]}>
      <Text style={styles.badgeText}>{item.category}</Text>
    </View>

    <View style={styles.cardImageContainer}>
      <Image source={{ uri: item.image }} style={styles.cardImage} resizeMode="contain" />
    </View>

    <Text style={styles.cardTitle} numberOfLines={2}>
      {item.title}
    </Text>

    <View style={styles.cardFooter}>
      <View style={styles.timeRow}>
        <Ionicons name="time-outline" size={14} color="#8E8E93" />
        <Text style={styles.timeText}>{item.time}</Text>
      </View>
      <Text style={styles.distanceText}>d{item.distance}</Text>
    </View>

    {/* People Counter */}
    <View style={styles.peopleSection}>
      <Text style={styles.peopleText}>
        {item.current}/{item.total}
      </Text>
    </View>

    {/* Progress Bar */}
    <View style={styles.progressContainer}>
      <View style={styles.progressTrack}>
        <View
          style={[
            styles.progressFill,
            {
              width: `${
                item.total > 0 ? Math.min(100, (item.current / item.total) * 100) : 0
              }%`,
            },
          ]}
        />
      </View>
    </View>

    {/* Join Button */}
    <TouchableOpacity
      style={styles.joinButton}
      activeOpacity={0.8}
      onPress={() => router.push(`/events/${item.id}` as any)}
    >
      <Text style={styles.joinButtonText}>Join</Text>
    </TouchableOpacity>
  </TouchableOpacity>
);

// ---------- Ecranul ----------
export default function HomeScreen() {
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [cards, setCards] = useState<GridCardItem[]>([]);
  const { sendDefaultRequest } = useRequests();

  useEffect(() => {
    (async () => {
      try {
        const res = await sendDefaultRequest<{ success: boolean; events: EventDTO[] }>({
          url: `${SERVER_AJAX_URL}/events/list.php`,
          data: {}, // fără filtre conform cerinței
        });

        const mapped: GridCardItem[] = (res?.events || []).map((e) => {
          const date = new Date((e.startsAt || 0) * 1000);
          const time = isNaN(date.getTime())
            ? ""
            : date.toLocaleTimeString(undefined, {
                hour: "numeric",
                minute: "2-digit",
              });
          return {
            id: String(e.id),
            category: (e.category || "Other").toUpperCase(),
            title: e.title || "",
            time,
            distance: "", // nu avem de la server încă
            image: placeholderImg,
            badgeColor: categoryColor[e.category] || "#8E8E93",
            current: 0, // TODO: pune nr. participanți când ai date
            total: e.capacity ?? 0, // capacity sau 0 dacă unlimited
          };
        });

        setCards(mapped);
      } catch (err) {
        // poți pune un toast sau fallback
        setCards([]); // fallback: gol
      }
    })();
  }, []);

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Ionicons name="location-outline" size={22} color="#1C1C1E" />
            <TouchableOpacity
              style={styles.locationTexts}
              onPress={() => router.push("/country")}
              activeOpacity={0.7}
            >
              <Text style={styles.locationLabel}>Location</Text>
              <Text style={styles.locationValue}>Denmark, Copenhagen</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.headerRight}>
            <TouchableOpacity
              style={styles.iconButton}
              activeOpacity={0.7}
              onPress={() => router.push("/notifications")}
            >
              <Ionicons name="notifications-outline" size={24} color="#1C1C1E" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.addButton}
              activeOpacity={0.7}
              onPress={() => router.push("/events/create")}
            >
              <Ionicons name="add-outline" size={24} color="#000000" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Greeting */}
        <View style={styles.sectionHeader}>
          <Text style={styles.greetingText}>Hello Alexa</Text>
          <Text style={styles.sectionTitle}>Let's find events near you</Text>
        </View>

        {/* Search */}
        <View style={styles.searchContainer}>
          <View style={styles.searchBox}>
            <Ionicons
              name="search-outline"
              size={20}
              color="#8E8E93"
              style={styles.searchIcon}
            />
            <Text style={styles.searchPlaceholder}>Search</Text>
          </View>
          <TouchableOpacity
            style={styles.filterButton}
            activeOpacity={0.7}
            onPress={() => setShowFilters((v) => !v)}
          >
            <Ionicons name="options-outline" size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        {/* Filter Chips */}
        {showFilters && (
          <View style={styles.filtersSection}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.filtersContainer}
            >
              {filterChips.map((chip, index) => (
                <Chip key={index} title={chip} />
              ))}
            </ScrollView>
          </View>
        )}

        {/* Categories */}
        <View style={styles.categoriesSection}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesContainer}
          >
            {categories.map((cat) => {
              const selected = selectedCategory === cat.id;
              return (
                <TouchableOpacity
                  key={cat.id}
                  style={[
                    styles.categoryTile,
                    selected && styles.categoryTileSelected,
                  ]}
                  activeOpacity={0.8}
                  onPress={() => setSelectedCategory(selected ? null : cat.id)}
                >
                  <Ionicons
                    name={cat.icon as any}
                    size={22}
                    color={selected ? "#FFFFFF" : "#1C1C1E"}
                    style={{ marginBottom: 6 }}
                  />
                  <Text
                    style={[
                      styles.categoryText,
                      selected && styles.categoryTextSelected,
                    ]}
                  >
                    {cat.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* Grid Cards (din backend) */}
        <View style={styles.gridContainer}>
          {cards.map((item) => (
            <View key={item.id} style={styles.gridItemWrapper}>
              <GridCard item={item} />
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// NU includ styles aici — păstrezi exact obiectul tău `styles` existent.


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  locationTexts: {
    flexDirection: "column",
    marginLeft: 8,
  },
  locationLabel: {
    fontSize: 12,
    fontWeight: "500",
    color: "#8E8E93",
  },
  locationValue: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1C1C1E",
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  iconButton: {
    padding: 8,
  },
  addButton: {
    width: 30,
    height: 30,
    borderWidth: 1,
    borderColor: "#000000",
    borderRadius: 9,
    backgroundColor: "transparent",
    alignItems: "center",
    justifyContent: "center",
  },
  sectionHeader: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1C1C1E",
  },
  greetingText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#8E8E93",
    marginBottom: 4,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  searchBox: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F2F2F7",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 12,
    marginRight: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchPlaceholder: {
    fontSize: 16,
    color: "#8E8E93",
  },
  filterButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: "#2F6BFF",
    alignItems: "center",
    justifyContent: "center",
  },
  categoriesSection: {
    marginBottom: 20,
  },
  categoriesContainer: {
    paddingHorizontal: 20,
    gap: 10,
  },
  categoryTile: {
    width: 72,
    height: 72,
    borderRadius: 12,
    backgroundColor: "#F2F2F7",
    alignItems: "center",
    justifyContent: "center",
  },
  categoryTileSelected: {
    backgroundColor: "#2F6BFF",
  },
  categoryText: {
    fontSize: 12,
    color: "#1C1C1E",
  },
  categoryTextSelected: {
    color: "#FFFFFF",
  },
  filtersSection: {
    marginBottom: 15,
  },
  filtersContainer: {
    paddingHorizontal: 20,
    gap: 8,
  },
  chip: {
    backgroundColor: "#F2F2F7",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
  },
  chipText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#1C1C1E",
  },
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 20,
    gap: 16,
  },
  gridItemWrapper: {
    width: "47%",
  },
  gridCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  badge: {
    position: "absolute",
    top: 12,
    left: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    zIndex: 1,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: "600",
    color: "#FFFFFF",
    textTransform: "uppercase",
  },
  cardImageContainer: {
    alignItems: "center",
    marginTop: 20,
    marginBottom: 16,
  },
  cardImage: {
    width: 64,
    height: 64,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1C1C1E",
    marginBottom: 12,
    lineHeight: 20,
  },
  cardFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  timeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  timeText: {
    fontSize: 12,
    fontWeight: "500",
    color: "#8E8E93",
  },
  distanceText: {
    fontSize: 12,
    fontWeight: "500",
    color: "#8E8E93",
  },
  peopleSection: {
    marginBottom: 8,
  },
  peopleText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1C1C1E",
  },
  progressContainer: {
    marginBottom: 16,
  },
  progressTrack: {
    height: 6,
    backgroundColor: "#E5E5EA",
    borderRadius: 3,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#34C759",
    borderRadius: 3,
  },
  joinButton: {
    backgroundColor: "#3460F7",
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  joinButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },
});