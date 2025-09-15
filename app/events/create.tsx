import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { SERVER_AJAX_URL, useRequests } from '@/hooks/useRequests';

const categories = ['Sport', 'Family', 'Music', 'Art', 'Health', 'Party', 'Business'];
const durations = ['30m', '1h', '1h 30m', '2h', 'Custom'];
const audiences = ['All', 'Female', 'Male'];
const privacyOptions = ['Public', 'Private'];
const joinTypes = ['Join directly', 'Request to join'];

interface FormData {
  title: string;
  description: string;
  category: string;
  date: Date;
  time: Date;
  duration: string;
  location: string;
  capacity: string;
  unlimitedCapacity: boolean;
  minAge: string;
  maxAge: string;
  audience: string;
  privacy: string;
  joinType: string;
}

export default function CreateEventScreen() {
  const [formData, setFormData] = useState<FormData>({
    title: '',
    description: '',
    category: 'Sport',
    date: new Date(),
    time: new Date(),
    duration: '1h',
    location: '',
    capacity: '',
    unlimitedCapacity: false,
    minAge: '',
    maxAge: '',
    audience: 'All',
    privacy: 'Public',
    joinType: 'Join directly',
  });

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { sendDefaultRequest } = useRequests();


  // const validateForm = (): boolean => {
  //   const newErrors: Record<string, string> = {};

  //   // Title validation
  //   if (!formData.title.trim()) {
  //     newErrors.title = 'Title is required';
  //   } else if (formData.title.length > 60) {
  //     newErrors.title = 'Title must be 60 characters or less';
  //   }

  //   // Date validation
  //   const now = new Date();
  //   const eventDateTime = new Date(formData.date);
  //   eventDateTime.setHours(formData.time.getHours(), formData.time.getMinutes());
    
  //   if (eventDateTime <= now) {
  //     newErrors.date = 'Event must be in the future';
  //   }

  //   // Location validation
  //   if (!formData.location.trim()) {
  //     newErrors.location = 'Location is required';
  //   }

  //   // Capacity validation
  //   if (!formData.unlimitedCapacity) {
  //     const capacity = parseInt(formData.capacity);
  //     if (!formData.capacity || isNaN(capacity) || capacity < 1 || capacity > 500) {
  //       newErrors.capacity = 'Capacity must be between 1 and 500';
  //     }
  //   }

  //   // Age range validation
  //   if (formData.minAge && formData.maxAge) {
  //     const min = parseInt(formData.minAge);
  //     const max = parseInt(formData.maxAge);
  //     if (min > max) {
  //       newErrors.minAge = 'Min age cannot be greater than max age';
  //     }
  //   }

  //   setErrors(newErrors);
  //   return Object.keys(newErrors).length === 0;
  // };

const durationToMin = (d: string): number => {
  switch (d) {
    case '30m': return 30;
    case '1h': return 60;
    case '1h 30m': return 90;
    case '2h': return 120;
    default: return 60;
  }
};

const buildStartsAt = (date: Date, time: Date) => {
  const dt = new Date(date);
  dt.setHours(time.getHours(), time.getMinutes(), 0, 0);
  return Math.floor(dt.getTime() / 1000);
};


const DEBUG = true; // pune false când nu mai ai nevoie de loguri

const handleSubmit = async () => {
  // pentru test, poți comenta validarea
  // if (!validateForm()) return;

  try {
    const startsAt = buildStartsAt(formData.date, formData.time);
    const durationMin = durationToMin(formData.duration);

    const payload = {
      title: formData.title.trim(),
      description: formData.description.trim(),
      category: formData.category,
      startsAt,
      durationMin,
      location: formData.location.trim(),
      capacity: formData.unlimitedCapacity ? '' : formData.capacity.trim(),
      minAge: formData.minAge.trim(),
      maxAge: formData.maxAge.trim(),
      audience: formData.audience,
      privacy: formData.privacy,
      joinType: formData.joinType
    };

    if (DEBUG) {
      console.log('➡️ [CreateEvent] URL:', `${SERVER_AJAX_URL}/events/create.php`);
      console.log('➡️ [CreateEvent] Payload:', JSON.stringify(payload, null, 2));
    }

    const res = await sendDefaultRequest({
      url: `${SERVER_AJAX_URL}/events/create.php`,
      data: payload,
    });

    if (DEBUG) {
      console.log('✅ [CreateEvent] Response:', JSON.stringify(res, null, 2));
    }

    Alert.alert('Success', 'Event created successfully!', [
      { text: 'OK', onPress: () => router.back() }
    ]);
  } catch (e: any) {
    console.error('❌ [CreateEvent] Error:', e);
    Alert.alert('Error', e?.message || 'Failed to create event');
  }
};




  const handleCancel = () => {
    router.back();
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const formatTime = (time: Date) => {
    return time.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const PillSelector = ({ 
    options, 
    selected, 
    onSelect 
  }: { 
    options: string[]; 
    selected: string; 
    onSelect: (value: string) => void;
  }) => (
    <View style={styles.pillContainer}>
      {options.map((option) => (
        <TouchableOpacity
          key={option}
          style={[
            styles.pill,
            selected === option && styles.pillSelected
          ]}
          onPress={() => onSelect(option)}
          activeOpacity={0.7}
        >
          <Text style={[
            styles.pillText,
            selected === option && styles.pillTextSelected
          ]}>
            {option}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  return (
    <>
      <Stack.Screen 
        options={{ 
          title: 'Create Event',
          headerShown: true,
          headerBackTitleVisible: false,
        }} 
      />
      <SafeAreaView style={styles.container} edges={['bottom']}>
        <KeyboardAvoidingView 
          style={styles.keyboardContainer}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <ScrollView 
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {/* Basics Section */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Basics</Text>
              
              <View style={styles.fieldContainer}>
                <Text style={styles.fieldLabel}>Title *</Text>
                <TextInput
                  style={[styles.textInput, errors.title && styles.inputError]}
                  value={formData.title}
                  onChangeText={(text) => setFormData({ ...formData, title: text })}
                  placeholder="Enter event title"
                  maxLength={60}
                />
                {errors.title && <Text style={styles.errorText}>{errors.title}</Text>}
                <Text style={styles.helperText}>{formData.title.length}/60 characters</Text>
              </View>

              <View style={styles.fieldContainer}>
                <Text style={styles.fieldLabel}>Description</Text>
                <TextInput
                  style={[styles.textArea, errors.description && styles.inputError]}
                  value={formData.description}
                  onChangeText={(text) => setFormData({ ...formData, description: text })}
                  placeholder="Describe your event..."
                  multiline
                  numberOfLines={4}
                  maxLength={500}
                />
                <Text style={styles.helperText}>{formData.description.length}/500 characters</Text>
              </View>

              <View style={styles.fieldContainer}>
                <Text style={styles.fieldLabel}>Category</Text>
                <PillSelector
                  options={categories}
                  selected={formData.category}
                  onSelect={(category) => setFormData({ ...formData, category })}
                />
              </View>
            </View>

            {/* Time & Place Section */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Time & Place</Text>
              
              <View style={styles.fieldContainer}>
                <Text style={styles.fieldLabel}>Date & Time *</Text>
                <View style={styles.dateTimeContainer}>
                  <TouchableOpacity
                    style={[styles.dateTimeButton, errors.date && styles.inputError]}
                    onPress={() => setShowDatePicker(true)}
                    activeOpacity={0.7}
                  >
                    <Ionicons name="calendar-outline" size={20} color="#8E8E93" />
                    <Text style={styles.dateTimeText}>{formatDate(formData.date)}</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    style={styles.dateTimeButton}
                    onPress={() => setShowTimePicker(true)}
                    activeOpacity={0.7}
                  >
                    <Ionicons name="time-outline" size={20} color="#8E8E93" />
                    <Text style={styles.dateTimeText}>{formatTime(formData.time)}</Text>
                  </TouchableOpacity>
                </View>
                {errors.date && <Text style={styles.errorText}>{errors.date}</Text>}
              </View>

              <View style={styles.fieldContainer}>
                <Text style={styles.fieldLabel}>Duration</Text>
                <PillSelector
                  options={durations}
                  selected={formData.duration}
                  onSelect={(duration) => setFormData({ ...formData, duration })}
                />
              </View>

              <View style={styles.fieldContainer}>
                <Text style={styles.fieldLabel}>Location *</Text>
                <View style={styles.locationContainer}>
                  <Ionicons name="location-outline" size={20} color="#8E8E93" style={styles.locationIcon} />
                  <TextInput
                    style={[styles.locationInput, errors.location && styles.inputError]}
                    value={formData.location}
                    onChangeText={(text) => setFormData({ ...formData, location: text })}
                    placeholder="Enter address or venue"
                  />
                </View>
                {errors.location && <Text style={styles.errorText}>{errors.location}</Text>}
                {formData.location.trim() && (
                  <View style={styles.mapPreview}>
                    <Ionicons name="map" size={24} color="#8E8E93" />
                    <Text style={styles.mapPreviewText}>Map preview for: {formData.location}</Text>
                  </View>
                )}
              </View>
            </View>

            {/* Attendance Section */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Attendance</Text>
              
              <View style={styles.fieldContainer}>
                <Text style={styles.fieldLabel}>Capacity</Text>
                <View style={styles.capacityContainer}>
                  <View style={styles.unlimitedToggle}>
                    <Text style={styles.toggleLabel}>Unlimited</Text>
                    <Switch
                      value={formData.unlimitedCapacity}
                      onValueChange={(value) => setFormData({ ...formData, unlimitedCapacity: value, capacity: value ? '' : formData.capacity })}
                      trackColor={{ false: '#E5E5EA', true: '#34C759' }}
                      thumbColor="#FFFFFF"
                    />
                  </View>
                  {!formData.unlimitedCapacity && (
                    <TextInput
                      style={[styles.capacityInput, errors.capacity && styles.inputError]}
                      value={formData.capacity}
                      onChangeText={(text) => setFormData({ ...formData, capacity: text })}
                      placeholder="Max participants"
                      keyboardType="numeric"
                    />
                  )}
                </View>
                {errors.capacity && <Text style={styles.errorText}>{errors.capacity}</Text>}
              </View>

              <View style={styles.fieldContainer}>
                <Text style={styles.fieldLabel}>Age Range</Text>
                <View style={styles.ageRangeContainer}>
                  <TextInput
                    style={[styles.ageInput, errors.minAge && styles.inputError]}
                    value={formData.minAge}
                    onChangeText={(text) => setFormData({ ...formData, minAge: text })}
                    placeholder="Min age"
                    keyboardType="numeric"
                  />
                  <Text style={styles.ageRangeSeparator}>to</Text>
                  <TextInput
                    style={styles.ageInput}
                    value={formData.maxAge}
                    onChangeText={(text) => setFormData({ ...formData, maxAge: text })}
                    placeholder="Max age"
                    keyboardType="numeric"
                  />
                </View>
                {errors.minAge && <Text style={styles.errorText}>{errors.minAge}</Text>}
              </View>

              <View style={styles.fieldContainer}>
                <Text style={styles.fieldLabel}>Audience</Text>
                <PillSelector
                  options={audiences}
                  selected={formData.audience}
                  onSelect={(audience) => setFormData({ ...formData, audience })}
                />
              </View>
            </View>

            {/* Settings Section */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Settings</Text>
              
              <View style={styles.fieldContainer}>
                <Text style={styles.fieldLabel}>Privacy</Text>
                <PillSelector
                  options={privacyOptions}
                  selected={formData.privacy}
                  onSelect={(privacy) => setFormData({ ...formData, privacy })}
                />
                <Text style={styles.helperText}>
                  {formData.privacy === 'Public' ? 'Anyone can find and join your event' : 'Only people you invite can see your event'}
                </Text>
              </View>

              <View style={styles.fieldContainer}>
                <Text style={styles.fieldLabel}>Join Type</Text>
                <PillSelector
                  options={joinTypes}
                  selected={formData.joinType}
                  onSelect={(joinType) => setFormData({ ...formData, joinType })}
                />
                <Text style={styles.helperText}>
                  {formData.joinType === 'Join directly' ? 'People can join immediately' : 'You approve each request to join'}
                </Text>
              </View>
            </View>

            {/* Bottom spacing for buttons */}
            <View style={styles.bottomSpacer} />
          </ScrollView>

          {/* Action Buttons */}
          <View style={styles.actionContainer}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={handleCancel}
              activeOpacity={0.7}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.createButton}
              onPress={handleSubmit}
              activeOpacity={0.8}
            >
              <Text style={styles.createButtonText}>Create Event</Text>
            </TouchableOpacity>

          </View>

          {/* Date/Time Pickers */}
          {showDatePicker && (
            <DateTimePicker
              value={formData.date}
              mode="date"
              display="default"
              onChange={(event, selectedDate) => {
                setShowDatePicker(false);
                if (selectedDate) {
                  setFormData({ ...formData, date: selectedDate });
                }
              }}
            />
          )}

          {showTimePicker && (
            <DateTimePicker
              value={formData.time}
              mode="time"
              display="default"
              onChange={(event, selectedTime) => {
                setShowTimePicker(false);
                if (selectedTime) {
                  setFormData({ ...formData, time: selectedTime });
                }
              }}
            />
          )}
        </KeyboardAvoidingView>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  keyboardContainer: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 120,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1C1C1E',
    marginBottom: 16,
  },
  fieldContainer: {
    marginBottom: 20,
  },
  fieldLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1C1C1E',
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: '#F2F2F7',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#1C1C1E',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  textArea: {
    backgroundColor: '#F2F2F7',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#1C1C1E',
    borderWidth: 1,
    borderColor: 'transparent',
    minHeight: 100,
    textAlignVertical: 'top',
  },
  inputError: {
    borderColor: '#FF3B30',
  },
  errorText: {
    fontSize: 14,
    color: '#FF3B30',
    marginTop: 4,
  },
  helperText: {
    fontSize: 14,
    color: '#8E8E93',
    marginTop: 4,
  },
  pillContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  pill: {
    backgroundColor: '#F2F2F7',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  pillSelected: {
    backgroundColor: '#007AFF',
  },
  pillText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1C1C1E',
  },
  pillTextSelected: {
    color: '#FFFFFF',
  },
  dateTimeContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  dateTimeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F2F2F7',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  dateTimeText: {
    fontSize: 16,
    color: '#1C1C1E',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F2F2F7',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  locationIcon: {
    marginRight: 8,
  },
  locationInput: {
    flex: 1,
    fontSize: 16,
    color: '#1C1C1E',
  },
  mapPreview: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
    padding: 12,
    marginTop: 8,
    gap: 8,
  },
  mapPreviewText: {
    fontSize: 14,
    color: '#8E8E93',
  },
  capacityContainer: {
    gap: 12,
  },
  unlimitedToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F2F2F7',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  toggleLabel: {
    fontSize: 16,
    color: '#1C1C1E',
  },
  capacityInput: {
    backgroundColor: '#F2F2F7',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#1C1C1E',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  ageRangeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  ageInput: {
    flex: 1,
    backgroundColor: '#F2F2F7',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#1C1C1E',
    textAlign: 'center',
  },
  ageRangeSeparator: {
    fontSize: 16,
    color: '#8E8E93',
  },
  bottomSpacer: {
    height: 20,
  },
  actionContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E5EA',
    flexDirection: 'row',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#F2F2F7',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#8E8E93',
  },
  createButton: {
    flex: 2,
    backgroundColor: '#3460F7',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  createButtonDisabled: {
    backgroundColor: '#C7C7CC',
  },
  createButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});