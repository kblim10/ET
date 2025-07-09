import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../redux/store';
import { logoutUser } from '../redux/authSlice';
import Header from '../components/Header';
import EcoterraLogo from '../components/EcoterraLogo';

interface HomeScreenProps {
  navigation: any;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          onPress: () => dispatch(logoutUser()),
        },
      ]
    );
  };

  const menuItems = [
    {
      title: 'Quiz & Learning',
      description: 'Test your knowledge about ecosystems',
      icon: '📚',
      onPress: () => Alert.alert('Coming Soon', 'Quiz feature will be available soon!'),
    },
    {
      title: 'Community',
      description: 'Connect with other learners',
      icon: '👥',
      onPress: () => Alert.alert('Coming Soon', 'Community feature will be available soon!'),
    },
    {
      title: 'Schedule',
      description: 'Manage your learning schedule',
      icon: '📅',
      onPress: () => Alert.alert('Coming Soon', 'Schedule feature will be available soon!'),
    },
    {
      title: 'Achievements',
      description: 'View your progress and badges',
      icon: '🏆',
      onPress: () => Alert.alert('Coming Soon', 'Achievements feature will be available soon!'),
    },
  ];

  const getRoleDisplayName = (role: string) => {
    switch (role) {
      case 'guru': return 'Teacher';
      case 'murid': return 'Student';
      case 'masyarakat': return 'Community Member';
      default: return role;
    }
  };

  return (
    <View style={styles.container}>
      <Header 
        title="Ecoterra" 
        subtitle="Welcome back!"
        rightComponent={
          <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        }
      />
      
      <ScrollView style={styles.content}>
        {/* Welcome Section */}
        <View style={styles.welcomeSection}>
          <EcoterraLogo size={80} />
          <Text style={styles.welcomeText}>
            Hello, {user?.fullName || 'User'}!
          </Text>
          <Text style={styles.roleText}>
            {getRoleDisplayName(user?.role || '')}
          </Text>
        </View>

        {/* Quick Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>0</Text>
            <Text style={styles.statLabel}>Quizzes Completed</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>0</Text>
            <Text style={styles.statLabel}>Points Earned</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>0</Text>
            <Text style={styles.statLabel}>Achievements</Text>
          </View>
        </View>

        {/* Menu Items */}
        <View style={styles.menuContainer}>
          <Text style={styles.sectionTitle}>Explore</Text>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.menuItem}
              onPress={item.onPress}
              activeOpacity={0.7}
            >
              <View style={styles.menuIcon}>
                <Text style={styles.menuIconText}>{item.icon}</Text>
              </View>
              <View style={styles.menuContent}>
                <Text style={styles.menuTitle}>{item.title}</Text>
                <Text style={styles.menuDescription}>{item.description}</Text>
              </View>
              <Text style={styles.menuArrow}>→</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Learning Quote */}
        <View style={styles.quoteContainer}>
          <Text style={styles.quoteText}>
            "The Earth does not belong to us; we belong to the Earth. All things are connected like the blood that unites one family."
          </Text>
          <Text style={styles.quoteAuthor}>- Chief Seattle</Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  logoutButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  logoutText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  welcomeSection: {
    alignItems: 'center',
    paddingVertical: 30,
    backgroundColor: '#fff',
    borderRadius: 12,
    marginTop: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c5530',
    marginTop: 16,
    textAlign: 'center',
  },
  roleText: {
    fontSize: 16,
    color: '#666',
    marginTop: 4,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingVertical: 20,
    alignItems: 'center',
    marginHorizontal: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c5530',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    marginTop: 4,
  },
  menuContainer: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c5530',
    marginBottom: 16,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  menuIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  menuIconText: {
    fontSize: 24,
  },
  menuContent: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  menuDescription: {
    fontSize: 14,
    color: '#666',
  },
  menuArrow: {
    fontSize: 18,
    color: '#2c5530',
    fontWeight: 'bold',
  },
  quoteContainer: {
    backgroundColor: '#2c5530',
    borderRadius: 12,
    padding: 20,
    marginBottom: 30,
  },
  quoteText: {
    fontSize: 16,
    color: '#fff',
    fontStyle: 'italic',
    textAlign: 'center',
    lineHeight: 24,
  },
  quoteAuthor: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    marginTop: 12,
  },
});

export default HomeScreen;
