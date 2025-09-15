import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Switch,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState, useEffect, useRef } from "react";
import { Stack } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

const mockCities = [
  "Copenhagen, Denmark",
  "Stockholm, Sweden",
  "Oslo, Norway",
  "Helsinki, Finland",
  "Reykjavik, Iceland",
];

type Mode = "device" | "manual";

export default function CountryScreen() {
  const [mode, setMode] = useState<Mode>("device");
  const [city, setCity] = useState("Copenhagen");
  const [country, setCountry] = useState("Denmark");
  const [approximate, setApproximate] = useState(false);
  const [loading, setLoading] = useState(false);
  const isMounted = useRef(true);

  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  const handleGetCurrentLocation = () => {
    setLoading(true);
    setTimeout(() => {
      if (isMounted.current) {
        setCity("Copenhagen");
        setCountry("Denmark");
        setLoading(false);
      }
    }, 900);
  };

  const handleSave = () => {
    Alert.alert("Success", "Saved (UI only)", [
      { text: "OK", onPress: () => {} },
    ]);
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: "Country",
          headerShown: true,
          headerBackTitleVisible: false,
        }}
      />
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.title}>Location</Text>

          <View style={styles.card}>
            <Text style={styles.currentLocation}>
              {city}, {country}
            </Text>
            <Text style={styles.lastUpdated}>Last updated: —</Text>
          </View>

          {/* Mode Selector */}
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Location Mode</Text>
            <View style={styles.segmentedControl}>
              <TouchableOpacity
                style={[
                  styles.segmentButton,
                  styles.segmentButtonLeft,
                  mode === "device" && styles.segmentButtonActive,
                ]}
                onPress={() => setMode("device")}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.segmentText,
                    mode === "device" && styles.segmentTextActive,
                  ]}
                >
                  Use Device
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.segmentButton,
                  styles.segmentButtonRight,
                  mode === "manual" && styles.segmentButtonActive,
                ]}
                onPress={() => setMode("manual")}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.segmentText,
                    mode === "manual" && styles.segmentTextActive,
                  ]}
                >
                  Set Manually
                </Text>
              </TouchableOpacity>
            </View>

            {mode === "device" ? (
              <View style={styles.deviceLocationSection}>
                <TouchableOpacity
                  style={[
                    styles.locationButton,
                    loading && styles.locationButtonDisabled,
                  ]}
                  onPress={handleGetCurrentLocation}
                  disabled={loading}
                  activeOpacity={0.7}
                >
                  {loading ? (
                    <Text style={styles.locationButtonText}>
                      Getting location...
                    </Text>
                  ) : (
                    <>
                      <Ionicons
                        name="location-outline"
                        size={20}
                        color="#007AFF"
                      />
                      <Text style={styles.locationButtonText}>
                        Get Current Location
                      </Text>
                    </>
                  )}
                </TouchableOpacity>
                <Text style={styles.helperText}>
                  We'll use your device's GPS to find your current location
                </Text>
              </View>
            ) : (
              <View style={styles.manualLocationSection}>
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>City</Text>
                  <TextInput
                    style={styles.locationInput}
                    value={city}
                    onChangeText={setCity}
                    placeholder="Enter city"
                    placeholderTextColor="#8E8E93"
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Country</Text>
                  <TextInput
                    style={styles.locationInput}
                    value={country}
                    onChangeText={setCountry}
                    placeholder="Enter country"
                    placeholderTextColor="#8E8E93"
                  />
                </View>

                <View style={styles.mapPreview}>
                  <Text style={styles.mapPin}>📍</Text>
                  <Text style={styles.mapPreviewText}>
                    Map preview for {city}, {country}
                  </Text>
                </View>
              </View>
            )}
          </View>

          {/* Privacy Toggle */}
          <View style={styles.card}>
            <View style={styles.toggleRow}>
              <View style={styles.toggleContent}>
                <Text style={styles.toggleTitle}>
                  Share approximate location (city only)
                </Text>
              </View>
              <Switch
                value={approximate}
                onValueChange={setApproximate}
                trackColor={{ false: "#E5E5EA", true: "#34C759" }}
                thumbColor="#FFFFFF"
              />
            </View>
          </View>

          {/* Limits Card */}
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Limits</Text>
            <View style={styles.limitItem}>
              <Ionicons name="time-outline" size={16} color="#8E8E93" />
              <Text style={styles.limitText}>
                You can change location once every 24h
              </Text>
            </View>
            <View style={styles.limitItem}>
              <Ionicons name="calendar-outline" size={16} color="#8E8E93" />
              <Text style={styles.limitText}>Changes left this month: 3</Text>
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionContainer}>
            <TouchableOpacity
              style={styles.saveButton}
              onPress={handleSave}
              activeOpacity={0.8}
            >
              <Text style={styles.saveButtonText}>Save</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelButton} activeOpacity={0.7}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: "700",
    color: "#1C1C1E",
    marginBottom: 24,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  currentLocation: {
    fontSize: 20,
    fontWeight: "600",
    color: "#1C1C1E",
    marginBottom: 4,
  },
  lastUpdated: {
    fontSize: 14,
    color: "#8E8E93",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1C1C1E",
    marginBottom: 12,
  },
  segmentedControl: {
    flexDirection: "row",
    backgroundColor: "#F2F2F7",
    borderRadius: 8,
    padding: 2,
    marginBottom: 16,
  },
  segmentButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    alignItems: "center",
  },
  segmentButtonLeft: {
    borderTopLeftRadius: 6,
    borderBottomLeftRadius: 6,
  },
  segmentButtonRight: {
    borderTopRightRadius: 6,
    borderBottomRightRadius: 6,
  },
  segmentButtonActive: {
    backgroundColor: "#FFFFFF",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  segmentText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#8E8E93",
  },
  segmentTextActive: {
    color: "#1C1C1E",
  },
  deviceLocationSection: {
    alignItems: "center",
  },
  locationButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F2F2F7",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 8,
    gap: 8,
  },
  locationButtonDisabled: {
    opacity: 0.6,
  },
  locationButtonText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#007AFF",
  },
  helperText: {
    fontSize: 14,
    color: "#8E8E93",
    textAlign: "center",
  },
  manualLocationSection: {
    gap: 16,
  },
  inputGroup: {
    gap: 8,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: "500",
    color: "#1C1C1E",
  },
  locationInput: {
    backgroundColor: "#F2F2F7",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    color: "#1C1C1E",
  },
  mapPreview: {
    backgroundColor: "#F8F9FA",
    borderRadius: 8,
    paddingVertical: 24,
    alignItems: "center",
    gap: 8,
  },
  mapPin: {
    fontSize: 24,
  },
  mapPreviewText: {
    fontSize: 14,
    color: "#8E8E93",
  },
  toggleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  toggleContent: {
    flex: 1,
  },
  toggleTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: "#1C1C1E",
  },
  limitItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    gap: 8,
  },
  limitText: {
    fontSize: 14,
    color: "#8E8E93",
  },
  actionContainer: {
    marginTop: 24,
    gap: 12,
  },
  saveButton: {
    backgroundColor: "#007AFF",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  cancelButton: {
    backgroundColor: "#F2F2F7",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#8E8E93",
  },
});
