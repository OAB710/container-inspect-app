import React, {useLayoutEffect, useState} from 'react';
import {
  FlatList,
  Modal,
  Pressable,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import MainLayout from '../../components/MainLayout';
import MLoading from '../../components/MLoading';
import MEmpty from '../../components/MEmpty';
import MButton from '../../components/MButton';
import MStatusBadge from '../../components/MStatusBadge';
import {InspectionStackParamList} from '../../types/navigations/inspection-navigation';
import {useInspectionList} from '../../queries/useInspection';
import {useAuthStore} from '../../stores/authStore';
import inspectionListStyle from './styles/inspection-list.style';

type Props = NativeStackScreenProps<
  InspectionStackParamList,
  'InspectionListScreen'
>;

const InspectionListScreen: React.FC<Props> = ({navigation}) => {
  const {data, loading, error, refetch} = useInspectionList();
  const logout = useAuthStore(state => state.logout);
  const user = useAuthStore(state => state.user);
  const [menuVisible, setMenuVisible] = useState(false);

  const displayName =
    typeof user?.full_name === 'string' && user.full_name.trim()
      ? user.full_name
      : typeof user?.username === 'string' && user.username.trim()
      ? user.username
      : 'Người dùng';
  const role =
    typeof user?.role === 'string' && user.role.trim()
      ? user.role.trim().toLowerCase()
      : 'authenticated';
  const roleLabel =
    role === 'surveyor'
      ? 'Người giám định'
      : role === 'admin'
      ? 'Giám đốc'
      : 'Đã đăng nhập';

  const initials =
    displayName
      .trim()
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map(part => part[0])
      .join('')
      .toUpperCase() || 'U';

  const handleLogout = async () => {
    setMenuVisible(false);
    if (typeof logout === 'function') {
      await logout();
    }
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: 'Danh sách giám định',
      headerTitleAlign: 'left',
      headerRight: () => (
        <Pressable
          onPress={() => setMenuVisible(true)}
          style={inspectionListStyle.headerAvatarButton}
          hitSlop={10}>
          <Text style={inspectionListStyle.headerAvatarText}>{initials}</Text>
        </Pressable>
      ),
    });
  }, [navigation, initials]);

  useFocusEffect(
    React.useCallback(() => {
      refetch();
    }, [refetch]),
  );

  const isInitialLoading = loading && data.length === 0 && !error;

  const renderListEmpty = () => {
    if (loading) {
      return null;
    }

    if (error) {
      return <MEmpty text={error} />;
    }

    return <MEmpty text="Chưa có giám định nào" />;
  };

  return (
    <MainLayout scrollable={false}>
      <Modal
        visible={menuVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setMenuVisible(false)}>
        <Pressable
          style={inspectionListStyle.menuBackdrop}
          onPress={() => setMenuVisible(false)}>
          <View style={inspectionListStyle.menuCard}>
            <View style={inspectionListStyle.menuHeader}>
              <View style={inspectionListStyle.menuAvatar}>
                <Text style={inspectionListStyle.menuAvatarText}>
                  {initials}
                </Text>
              </View>

              <View style={inspectionListStyle.menuInfo}>
                <Text style={inspectionListStyle.menuName}>{displayName}</Text>
                <Text style={inspectionListStyle.menuMeta}>
                  {user?.username || '--'}
                </Text>
                <Text style={inspectionListStyle.menuMeta}>{roleLabel}</Text>
              </View>
            </View>

            <View style={inspectionListStyle.menuActions}>
              <TouchableOpacity
                onPress={handleLogout}
                style={inspectionListStyle.logoutButton}>
                <Text style={inspectionListStyle.logoutButtonText}>
                  Đăng xuất
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Pressable>
      </Modal>

      {isInitialLoading ? (
        <MLoading />
      ) : (
        <View>
          <FlatList
            data={data}
            keyExtractor={item => String(item.id)}
            refreshing={loading}
            onRefresh={refetch}
            ListEmptyComponent={renderListEmpty}
            contentContainerStyle={
              data.length === 0 ? {flexGrow: 1, justifyContent: 'center'} : undefined
            }
            ItemSeparatorComponent={() => <View style={{height: 12}} />}
            renderItem={({item}) => (
              <TouchableOpacity
                style={inspectionListStyle.card}
                onPress={() =>
                  navigation.navigate('InspectionDetailScreen', {
                    inspectionId: item.id,
                  })
                }>
                <View style={inspectionListStyle.cardTop}>
                  <Text style={inspectionListStyle.code}>
                    {item.inspection_code}
                  </Text>
                  <MStatusBadge status={item.status} />
                </View>

                <Text style={inspectionListStyle.text}>
                  Số container: {item.container?.container_no || '--'}
                </Text>
                <Text style={inspectionListStyle.text}>
                  Kết quả: {item.result || '--'}
                </Text>
                <Text style={inspectionListStyle.text}>
                  Ngày giám định:{' '}
                  {item.inspection_date
                    ? new Date(item.inspection_date).toLocaleString('vi-VN')
                    : '--'}
                </Text>
              </TouchableOpacity>
            )}
          />

          {!error && (
            <View style={inspectionListStyle.createButtonWrap}>
              <MButton
                title="Tạo mới giám định"
                onPress={() => navigation.navigate('InspectionDetailScreen')}
              />
            </View>
          )}
        </View>
      )}
    </MainLayout>
  );
};

export default InspectionListScreen;
