import React, {useCallback, useState} from 'react';
import {FlatList, Pressable, SafeAreaView, Text, View} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import AppEmptyState from '../../components/common/AppEmptyState';
import AppErrorState from '../../components/common/AppErrorState';
import AppLoader from '../../components/common/AppLoader';
import InspectionCard from '../../components/inspection/InspectionCard';
import {RootStackParamList} from '../../navigations/AppNavigator';
import {getInspections} from '../../services/inspectionService';
import {Inspection} from '../../types/inspection.types';
import styles from './InspectionListScreen.styles';

type Props = NativeStackScreenProps<RootStackParamList, 'InspectionList'>;

function InspectionListScreen({navigation}: Props): JSX.Element {
  const [inspections, setInspections] = useState<Inspection[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  const fetchInspections = useCallback(async () => {
    try {
      setLoading(true);
      setError('');

      const data = await getInspections();
      setInspections(data);
    } catch (err) {
      console.log('Lỗi tải danh sách giám định:', err);
      setError('Không thể tải danh sách giám định');
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchInspections();
    }, [fetchInspections]),
  );

  const renderItem = ({item}: {item: Inspection}) => {
    return (
      <InspectionCard
        item={item}
        onPress={() =>
          navigation.navigate('InspectionDetail', {inspectionId: item.id})
        }
      />
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.fullScreen}>
        <AppLoader message="Đang tải danh sách giám định..." />
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.fullScreen}>
        <AppErrorState message={error} onRetry={fetchInspections} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Danh sách giám định</Text>
          <Text style={styles.subtitle}>
            Theo dõi và quản lý các phiếu giám định container
          </Text>
        </View>

        <Pressable
          style={styles.addButton}
          onPress={() => navigation.navigate('InspectionDetail')}>
          <Text style={styles.addButtonText}>+ Tạo mới</Text>
        </Pressable>
      </View>

      <FlatList
        data={inspections}
        keyExtractor={item => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <AppEmptyState
            title="Chưa có phiếu giám định"
            message="Bạn hãy tạo mới một phiếu giám định để bắt đầu."
          />
        }
      />
    </SafeAreaView>
  );
}

export default InspectionListScreen;
