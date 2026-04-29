export interface BangladeshDistrictOption {
  value: string;
  label: string;
  thanas: string[];
}

export const bangladeshDistrictOptions: BangladeshDistrictOption[] = [
  {
    value: "dhaka",
    label: "Dhaka",
    thanas: [
      "Dhanmondi",
      "Mohammadpur",
      "Mirpur",
      "Gulshan",
      "Uttara",
      "Motijheel",
    ],
  },
  {
    value: "gazipur",
    label: "Gazipur",
    thanas: ["Tongi", "Sreepur", "Kaliakair", "Kapasia", "Gazipur Sadar"],
  },
  {
    value: "narayanganj",
    label: "Narayanganj",
    thanas: [
      "Narayanganj Sadar",
      "Fatullah",
      "Rupganj",
      "Araihazar",
      "Sonargaon",
    ],
  },
  {
    value: "chattogram",
    label: "Chattogram",
    thanas: ["Pahartali", "Kotwali", "Panchlaish", "Halishahar", "Patenga"],
  },
  {
    value: "cumilla",
    label: "Cumilla",
    thanas: ["Cumilla Sadar", "Daudkandi", "Muradnagar", "Burichang", "Chauddagram"],
  },
  {
    value: "sylhet",
    label: "Sylhet",
    thanas: ["Sylhet Sadar", "Beanibazar", "Golapganj", "Companiganj", "Balaganj"],
  },
  {
    value: "khulna",
    label: "Khulna",
    thanas: ["Khulna Sadar", "Sonadanga", "Dumuria", "Batiaghata", "Paikgachha"],
  },
  {
    value: "rajshahi",
    label: "Rajshahi",
    thanas: ["Boalia", "Paba", "Godagari", "Bagha", "Tanore"],
  },
  {
    value: "barishal",
    label: "Barishal",
    thanas: ["Barishal Sadar", "Bakerganj", "Banaripara", "Babuganj", "Muladi"],
  },
  {
    value: "rangpur",
    label: "Rangpur",
    thanas: ["Rangpur Sadar", "Gangachara", "Mithapukur", "Pirgachha", "Taraganj"],
  },
  {
    value: "mymensingh",
    label: "Mymensingh",
    thanas: ["Mymensingh Sadar", "Trishal", "Bhaluka", "Muktagachha", "Gauripur"],
  },
  {
    value: "bogura",
    label: "Bogura",
    thanas: ["Bogura Sadar", "Sherpur", "Shibganj", "Dhunat", "Gabtali"],
  },
];

export function getBangladeshDistrictByValue(value: string) {
  return (
    bangladeshDistrictOptions.find((district) => district.value === value) ||
    bangladeshDistrictOptions[0]
  );
}
