import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  FlatList,
  Image,
} from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router } from 'expo-router';

// Categories data
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

// Mock data for grid cards
const gridCards = [
  {
    id: "1",
    category: "SPORT",
    title: "Football 5v5",
    time: "6:00 PM",
    distance: "800 m",
    image: "https://cdn-icons-png.flaticon.com/512/4768/4768608.png",
    badgeColor: "#58cc02",
    current: 4,
    total: 10,
  },
  {
    id: "2",
    category: "FAMILY",
    title: "Family Playdate",
    time: "10:00 AM",
    distance: "1 km",
    image: "https://cdn-icons-png.flaticon.com/512/2024/2024735.png",
    badgeColor: "#1cb0f6",
    current: 3,
    total: 6,
  },
  {
    id: "3",
    category: "SOCIAL",
    title: "Concert in the Park",
    time: "7:00 PM",
    distance: "7.2 km",
    image: "https://cdn-icons-png.flaticon.com/512/1974/1974848.png",
    badgeColor: "#ff4b4b",
    current: 8,
    total: 10,
  },
  {
    id: "4",
    category: "SPORT",
    title: "Paddle Tennis",
    time: "5:30 PM",
    distance: "3 km",
    image: "https://cdn-icons-png.flaticon.com/512/1974/1974096.png",
    badgeColor: "#ff9600",
    current: 2,
    total: 4,
  },
  {
    id: "5",
    category: "PARTY",
    title: "Birthday Bash",
    time: "4:00 PM",
    distance: "2.5 km",
    image: "https://cdn-icons-png.flaticon.com/512/2372/2372389.png",
    badgeColor: "#ce82ff",
    current: 10,
    total: 10,
  },
];

const filterChips = [
  "Within 10 km",
  "Tonight",
  "Sports",
  "Music",
  "Family",
  "This week",
];

// Chip Component
const Chip = ({ title, onPress }: { title: string; onPress?: () => void }) => (
  <TouchableOpacity style={styles.chip} onPress={onPress} activeOpacity={0.7}>
    <Text style={styles.chipText}>{title}</Text>
  </TouchableOpacity>
);

const GridCard = ({ item, index }: { item: typeof gridCards[0]; index: number }) => (
  <TouchableOpacity
    style={styles.gridCard}
    activeOpacity={0.8}
    onPress={() => router.push(`/events/${item.id}` as any)}
  >
    <View style={[styles.badge, { backgroundColor: item.badgeColor }]}>
      <Text style={styles.badgeText}>{item.category}</Text>
    </View>
    
    <View style={styles.cardImageContainer}>
      <Image 
        source={{ uri: item.image }}
        style={styles.cardImage}
        resizeMode="contain"
      />
    </View>
    
    <Text style={styles.cardTitle} numberOfLines={2}>
      {item.title}
    </Text>
    
    <View style={styles.cardFooter}>
      <View style={styles.timeRow}>
        <Ionicons name="time-outline" size={14} color="#8E8E93" />
        <Text style={styles.timeText}>{item.time}</Text>
      </View>
      <Text style={styles.distanceText}>{item.distance}</Text>
    </View>
    
    {/* People Counter */}
    <View style={styles.peopleSection}>
      <Text style={styles.peopleText}>{item.current}/{item.total}</Text>
    </View>
    
    {/* Progress Bar */}
    <View style={styles.progressContainer}>
      <View style={styles.progressTrack}>
        <View 
          style={[
            styles.progressFill, 
            { width: `${(item.current / item.total) * 100}%` }
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

export default function HomeScreen() {
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

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
              onPress={() => router.push('/country')}
              activeOpacity={0.7}
            >
              <Text style={styles.locationLabel}>Location</Text>
              <Text style={styles.locationValue}>Denmark, Copenhagen</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.headerRight}>
            <TouchableOpacity style={styles.iconButton} activeOpacity={0.7} onPress={() => router.push('/notifications')}>
              <Ionicons
                name="notifications-outline"
                size={24}
                color="#1C1C1E"
              />
            </TouchableOpacity>
            <TouchableOpacity style={styles.addButton} activeOpacity={0.7} onPress={() => router.push('/events/create')}>
              <Ionicons name="add-outline" size={24} color="#000000" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Greeting */}
        <View style={styles.sectionHeader}>
          <Text style={styles.greetingText}>Hello Alexa</Text>
          <Text style={styles.sectionTitle}>
            Let's find events near you
          </Text>
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
                  onPress={() =>
                    setSelectedCategory(selected ? null : cat.id)
                  }
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

        {/* Grid Cards */}
        <View style={styles.gridContainer}>
          {gridCards.map((item, index) => (
            <View key={item.id} style={styles.gridItemWrapper}>
              <GridCard item={item} index={index} />
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

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