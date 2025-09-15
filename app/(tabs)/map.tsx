import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MapView, { Marker, Region } from 'react-native-maps';
import ClusteredMapView from 'react-native-map-clustering';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { SERVER_AJAX_URL, useRequests } from '@/hooks/useRequests';

type EventDTO = {
  id: number;
  title: string;
  description: string;
  category: 'Sport'|'Family'|'Music'|'Art'|'Health'|'Party'|'Business';
  startsAt: number;          // unix secunde
  durationMin: number;
  location: string;
  capacity: number | null;   // null = unlimited
  latitude?: number | null;  // IMPORTANT pt hartă
  longitude?: number | null;
};

const categoryColor: Record<string, string> = {
  Sport:    '#58cc02',
  Family:   '#1cb0f6',
  Music:    '#7b61ff',
  Art:      '#ff9600',
  Health:   '#34C759',
  Party:    '#ce82ff',
  Business: '#8E8E93',
};

const categoryIcon: Record<string, keyof typeof Ionicons.glyphMap> = {
  Sport:    'tennisball-outline',
  Family:   'people-outline',
  Music:    'musical-notes-outline',
  Art:      'color-palette-outline',
  Health:   'medkit-outline',
  Party:    'wine-outline',
  Business: 'briefcase-outline',
};

export default function MapScreen() {
  const { sendDefaultRequest } = useRequests();
  const [events, setEvents] = useState<EventDTO[]>([]);
  const [selected, setSelected] = useState<EventDTO | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await sendDefaultRequest<{ success: boolean; events: EventDTO[] }>({
          url: `${SERVER_AJAX_URL}/events/list.php`,
          data: {},
        });
        const withCoords = (res?.events || []).filter(
          e => typeof e.latitude === 'number' && typeof e.longitude === 'number'
        );
        setEvents(withCoords);
      } catch {
        setEvents([]);
      }
    })();
  }, []);

  const initialRegion: Region = useMemo(
    () => ({
      latitude: events[0]?.latitude ?? 55.6761,   // Copenhagen fallback
      longitude: events[0]?.longitude ?? 12.5683,
      latitudeDelta: 0.08,
      longitudeDelta: 0.08,
    }),
    [events]
  );

  const formatTime = (unix?: number) => {
    if (!unix) return '';
    const d = new Date(unix * 1000);
    return d.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' });
  };

  const capacityText = (e: EventDTO) => {
    if (e.capacity === null || e.capacity === undefined) return '—/∞';
    // până vei avea participanți reali, afișăm 3/total doar ca demo (poți pune 0/total)
    const current = 3; // TODO: înlocuiește cu numărul real de participanți
    return `${current}/${e.capacity}`;
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <View style={styles.content}>
        <ClusteredMapView
          style={styles.map}
          initialRegion={initialRegion}
          onPress={() => setSelected(null)}
          spiralEnabled
          animationEnabled
          showsUserLocation={false}
          showsMyLocationButton={false}
          clusterColor="#2F6BFF"
          clusterTextColor="#FFFFFF"
          clusterFontFamily={Platform.select({ ios: 'System', android: 'sans-serif-medium' })}
          extent={512} // clustering mai lin pe zoom-out
        >
          {events.map((e) => (
            <Marker
              key={e.id}
              coordinate={{ latitude: e.latitude as number, longitude: e.longitude as number }}
              onPress={() => setSelected(e)}
              tracksViewChanges={false}
            >
              {/* Marker custom – rotund + pointer, color pe categorie */}
              <View style={styles.pin}>
                <View style={[styles.pinBubble, { backgroundColor: categoryColor[e.category] || '#8E8E93' }]}>
                  <Ionicons name={categoryIcon[e.category] || 'location-outline'} size={16} color="#fff" />
                </View>
                <View style={[styles.pinPointer, { borderTopColor: categoryColor[e.category] || '#8E8E93' }]} />
              </View>
            </Marker>
          ))}
        </ClusteredMapView>

        {/* Cardul de jos, ca în mock */}
        {selected && (
          <View style={styles.bottomCardWrap}>
            <View style={styles.bottomCard}>
              <View style={styles.bottomLeft}>
                <View style={[styles.cardIconWrap, { backgroundColor: categoryColor[selected.category] || '#8E8E93' }]}>
                  <Ionicons name={categoryIcon[selected.category] || 'location-outline'} size={22} color="#fff" />
                </View>
                <View style={styles.cardTexts}>
                  <Text numberOfLines={1} style={styles.cardTitle}>{selected.title}</Text>
                  <Text style={styles.cardSub}>{capacityText(selected)}</Text>
                  <Text style={styles.cardMeta}>Today • {formatTime(selected.startsAt)}</Text>
                </View>
              </View>

              <TouchableOpacity
                style={styles.joinBtn}
                activeOpacity={0.85}
                onPress={() => router.push(`/events/${selected.id}` as any)}
              >
                <Text style={styles.joinBtnText}>Join</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

/** =============== STILURI =============== */
/** le-am inclus complet ca să arate ca în mock; poți ajusta după brandul tău */
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  content: { flex: 1 },
  map: { flex: 1 },

  // Marker custom (pin)
  pin: { alignItems: 'center' },
  pinBubble: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 2,
  },
  pinPointer: {
    width: 0,
    height: 0,
    borderLeftWidth: 6,
    borderRightWidth: 6,
    borderTopWidth: 8,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    marginTop: 2,
  },

  // Bottom card
  bottomCardWrap: {
    position: 'absolute',
    left: 0, right: 0, bottom: 16,
    paddingHorizontal: 16,
  },
  bottomCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 12,
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  bottomLeft: { flex: 1, flexDirection: 'row', alignItems: 'center' },
  cardIconWrap: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  cardTexts: { flex: 1 },
  cardTitle: { fontSize: 18, fontWeight: '700', color: '#1C1C1E' },
  cardSub: { fontSize: 14, fontWeight: '600', color: '#1C1C1E', marginTop: 2 },
  cardMeta: { fontSize: 14, color: '#8E8E93', marginTop: 2 },

  joinBtn: {
    backgroundColor: '#34C759',
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 12,
  },
  joinBtnText: { color: '#fff', fontWeight: '700', fontSize: 16 },
});
