import React, {PropsWithChildren} from 'react';
import {SafeAreaView, ScrollView, StyleSheet, View} from 'react-native';
import AppColors from '../constants/app-colors';

interface MainLayoutProps extends PropsWithChildren {
  scrollable?: boolean;
}

const MainLayout: React.FC<MainLayoutProps> = ({
  children,
  scrollable = true,
}) => {
  if (scrollable) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator
          persistentScrollbar>
          {children}
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.fixedContent}>{children}</View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: AppColors.background,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  fixedContent: {
    flex: 1,
    padding: 16,
  },
});

export default MainLayout;
