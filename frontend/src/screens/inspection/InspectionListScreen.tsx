import React from 'react';
import { FlatList, Text, TouchableOpacity, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import MainLayout from '../../components/MainLayout';
import MLoading from '../../components/MLoading';
import MEmpty from '../../components/MEmpty';
import MButton from '../../components/MButton';
import MStatusBadge from '../../components/MStatusBadge';
import { InspectionStackParamList } from '../../types/navigations/inspection-navigation';
import { useInspectionList } from '../../queries/useInspection';
import inspectionListStyle from './styles/inspection-list.style';

type Props = NativeStackScreenProps<InspectionStackParamList, 'InspectionListScreen'>;

const InspectionListScreen: React.FC<Props> = ({ navigation }) => {
  const { data, loading, error } = useInspectionList();

  return (
    <MainLayout>
      <View style={inspectionListStyle.createButtonWrap}>
        <MButton
          title="Tạo mới giám định"
          onPress={() => navigation.navigate('InspectionDetailScreen')}
        />
      </View>

      {loading && <MLoading />}
      {!loading && !!error && <MEmpty text={error} />}
      {!loading && !error && data.length === 0 && <MEmpty text="Chưa có giám định nào" />}

      {!loading && !error && data.length > 0 && (
        <FlatList
          data={data}
          scrollEnabled={false}
          keyExtractor={item => String(item.id)}
          ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={inspectionListStyle.card}
              onPress={() =>
                navigation.navigate('InspectionDetailScreen', { inspectionId: item.id })
              }
            >
              <View style={inspectionListStyle.cardTop}>
                <Text style={inspectionListStyle.code}>{item.inspection_code}</Text>
                <MStatusBadge status={item.status} />
              </View>

              <Text style={inspectionListStyle.text}>
                Container: {item.container?.container_no || '--'}
              </Text>
              <Text style={inspectionListStyle.text}>Kết quả: {item.result || '--'}</Text>
              <Text style={inspectionListStyle.text}>
                Ngày giám định:{' '}
                {item.inspection_date
                  ? new Date(item.inspection_date).toLocaleString('vi-VN')
                  : '--'}
              </Text>
            </TouchableOpacity>
          )}
        />
      )}
    </MainLayout>
  );
};

export default InspectionListScreen;