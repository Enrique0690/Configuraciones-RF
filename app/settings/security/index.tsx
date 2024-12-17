import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Colors } from '@/constants/Colors';
import { useTranslation } from 'react-i18next';
import { securityConfig } from '@/constants/DataConfig/SecurityConfig';
import EditableFieldRow from '@/components/Renders/EditableFieldRow';
import ButtonRow from '@/components/Renders/ButtonRow';
import { useLocalSearchParams } from 'expo-router';
import withDataFetch from '@/components/HOC/withDataFetch';

const SecurityScreen = ({ data }: { data: any }) => {
  const { t } = useTranslation();
  const { highlight } = useLocalSearchParams();

  return (
    <View style={[styles.container]}>
      {securityConfig.map(({ label, id, type }) => (
        <EditableFieldRow
          key={label}
          label={t(label)}
          value={data?.[id]}
          type={type}
          onSave={async (newValue) => {
            await data?.Configuracion.Set(id, newValue);
          }
          }
          textColor={Colors.text}
          highlight={highlight === id}
        />
      ))}

      <ButtonRow
        label={t('security.users')}
        route="./security/users/userlist"
        iconName="people-outline"
        dynamicContent={
          data?.['users']?.length
            ? `(${data['users'].length})`
            : ''
        }
      />
      <ButtonRow
        label={t('security.roles')}
        route="./security/rols/rollist"
        iconName="briefcase-outline"
        dynamicContent={
          data?.['roles']?.length
            ? `(${data['roles'].length})`
            : ''
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    borderRadius: 10,
  },
});

export default withDataFetch(SecurityScreen, 'download');