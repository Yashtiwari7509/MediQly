interface UserProps {
  firstName: string;
  lastName: string;
  email: string;
  id: string;
}
interface cardsProps {
  title: string;
  value: string;
  trend: string;
  icon: undefined;
  trendDirection: undefined;
}
interface profileProps {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  dob?: string;
  gender?: string;
}
interface doctorProfileProps {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
}
export type { UserProps, cardsProps, profileProps, doctorProfileProps };
