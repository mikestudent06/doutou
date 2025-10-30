export interface TabBarIconProps {
  focused: boolean;
  icon: string;
  title: string;
}
export interface CustomButtonProps {
  onPress?: () => void;
  title: string;
  style?: string;
  textStyle?: string;
  leftIcon?: string;
  rightIcon?: string;
  isLoading?: boolean;
} 