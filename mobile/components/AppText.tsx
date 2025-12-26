import { Text, TextProps } from 'react-native';

export default function AppText(props: TextProps) {
  return <Text {...props} style={[{ fontFamily: 'Schoolbell', fontSize: 40 }, props.style]} />;
}
