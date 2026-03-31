import React from 'react';
import {Text, TextInput, TextInputProps, View} from 'react-native';
import styles from './FormField.styles';

interface FormFieldProps extends TextInputProps {
  label: string;
  readOnly?: boolean;
}

function FormField({
  label,
  readOnly = false,
  multiline,
  style,
  ...props
}: FormFieldProps): JSX.Element {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        {...props}
        editable={!readOnly && props.editable !== false}
        style={[
          styles.input,
          multiline ? styles.multiline : null,
          readOnly ? styles.inputReadonly : null,
          style,
        ]}
        multiline={multiline}
      />
    </View>
  );
}

export default FormField;
