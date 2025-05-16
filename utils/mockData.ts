import { Diagnosis, MaintenanceTip, Professional, Quote, ServiceCategory } from '@/types';

export const serviceCategories: ServiceCategory[] = [
  {
    id: '1',
    name: 'Plumbing',
    icon: 'droplet',
    description: 'Water leaks, pipe issues, fixtures',
  },
  {
    id: '2',
    name: 'Electrical',
    icon: 'zap',
    description: 'Wiring, outlets, lighting problems',
  },
  {
    id: '3',
    name: 'HVAC',
    icon: 'thermometer',
    description: 'Heating, cooling, ventilation',
  },
  {
    id: '4',
    name: 'Appliances',
    icon: 'refrigerator',
    description: 'Repair and maintenance',
  },
  {
    id: '5',
    name: 'Carpentry',
    icon: 'hammer',
    description: 'Woodwork, doors, windows',
  },
  {
    id: '6',
    name: 'Roofing',
    icon: 'home',
    description: 'Roof repairs and inspections',
  },
];

export const maintenanceTips: MaintenanceTip[] = [
  {
    id: '1',
    title: 'Seasonal HVAC Maintenance',
    description: 'Change filters every 3 months and schedule professional inspection twice yearly to extend system life.',
    imageUrl: 'https://images.pexels.com/photos/4489732/pexels-photo-4489732.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  },
  {
    id: '2',
    title: 'Prevent Water Damage',
    description: 'Inspect plumbing connections and appliance hoses regularly to prevent costly leaks.',
    imageUrl: 'https://images.pexels.com/photos/5465225/pexels-photo-5465225.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  },
  {
    id: '3',
    title: 'Gutter Cleaning Guide',
    description: 'Clean gutters twice yearly to prevent water damage and extend roof life.',
    imageUrl: 'https://images.pexels.com/photos/6934018/pexels-photo-6934018.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  },
];

export const diagnoses: Diagnosis[] = [
  {
    id: '1',
    title: 'Kitchen Sink Leak',
    description: 'Water leaking from under the kitchen sink',
    imageUrl: 'https://images.pexels.com/photos/5824883/pexels-photo-5824883.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    createdAt: '2025-01-15T10:30:00Z',
    status: 'completed',
    result: {
      issue: 'Damaged P-trap connection',
      severity: 'medium',
      recommendedActions: [
        'Replace the P-trap assembly',
        'Check connecting pipes for corrosion',
        'Apply pipe thread sealant on connections'
      ],
      requiredParts: [
        {
          id: 'p1',
          name: 'P-trap assembly kit',
          estimatedCost: '$15-25',
          availabilityStatus: 'in-stock'
        },
        {
          id: 'p2',
          name: 'Pipe thread sealant',
          estimatedCost: '$5-10',
          availabilityStatus: 'in-stock'
        }
      ]
    }
  },
  {
    id: '2',
    title: 'Flickering Lights',
    description: 'Living room lights flicker intermittently',
    imageUrl: 'https://images.pexels.com/photos/6852018/pexels-photo-6852018.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    createdAt: '2025-02-02T15:45:00Z',
    status: 'completed',
    result: {
      issue: 'Loose wiring connection in light fixture',
      severity: 'low',
      recommendedActions: [
        'Turn off power at circuit breaker',
        'Remove light fixture and inspect wiring',
        'Tighten wire nuts and connections',
        'Replace fixture if necessary'
      ],
      requiredParts: [
        {
          id: 'p3',
          name: 'Wire nuts (pack)',
          estimatedCost: '$3-6',
          availabilityStatus: 'in-stock'
        }
      ]
    }
  },
  {
    id: '3',
    title: 'AC Not Cooling',
    description: 'Air conditioner running but not cooling properly',
    imageUrl: 'https://images.pexels.com/photos/4750270/pexels-photo-4750270.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    createdAt: '2025-02-15T09:15:00Z',
    status: 'pending'
  },
];

export const professionals: Professional[] = [
  {
    id: '1',
    name: 'Alex Rivera',
    profileImageUrl: 'https://images.pexels.com/photos/8961065/pexels-photo-8961065.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    specialties: ['Plumbing', 'Pipe Installation', 'Water Heaters'],
    rating: 4.8,
    reviews: 127,
    location: 'Portland, OR',
    distance: '3.2 miles',
    contactInfo: {
      phone: '(503) 555-1234',
      email: 'alex@plumbingpros.com',
      website: 'https://plumbingpros.com'
    },
    availability: {
      status: 'available',
      nextAvailable: 'Tomorrow, 9 AM'
    },
    hourlyRate: '$85-95',
    bio: 'Master plumber with 15+ years experience specializing in residential repairs and installations. Licensed and insured with a focus on quality workmanship.'
  },
  {
    id: '2',
    name: 'Sofia Chen',
    profileImageUrl: 'https://images.pexels.com/photos/3791136/pexels-photo-3791136.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    specialties: ['Electrical', 'Wiring', 'Panel Upgrades', 'Smart Home'],
    rating: 4.9,
    reviews: 93,
    location: 'Portland, OR',
    distance: '5.7 miles',
    contactInfo: {
      phone: '(503) 555-6789',
      email: 'sofia@chenelectrical.com'
    },
    availability: {
      status: 'limited',
      nextAvailable: 'Friday, 1 PM'
    },
    hourlyRate: '$90-110',
    bio: 'Licensed electrician specializing in residential electrical systems and smart home integration. Committed to safety and quality service with attention to detail.'
  },
  {
    id: '3',
    name: 'Marcus Johnson',
    profileImageUrl: 'https://images.pexels.com/photos/8961156/pexels-photo-8961156.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    specialties: ['HVAC', 'Air Conditioning', 'Heating', 'Ventilation'],
    rating: 4.7,
    reviews: 156,
    location: 'Portland, OR',
    distance: '4.1 miles',
    contactInfo: {
      phone: '(503) 555-4321',
      email: 'marcus@climatepros.com',
      website: 'https://climatepros.com'
    },
    availability: {
      status: 'available',
      nextAvailable: 'Today, 3 PM'
    },
    hourlyRate: '$95-120',
    bio: 'HVAC specialist with 10+ years experience in residential and light commercial systems. EPA certified with commitment to energy efficient solutions.'
  },
  {
    id: '4',
    name: 'Jasmine Taylor',
    profileImageUrl: 'https://images.pexels.com/photos/7642001/pexels-photo-7642001.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    specialties: ['Carpentry', 'Cabinets', 'Doors', 'Woodwork'],
    rating: 4.9,
    reviews: 78,
    location: 'Portland, OR',
    distance: '7.3 miles',
    contactInfo: {
      phone: '(503) 555-8765',
      email: 'jasmine@taylorwoodworks.com'
    },
    availability: {
      status: 'limited',
      nextAvailable: 'Next Monday, 10 AM'
    },
    hourlyRate: '$75-95',
    bio: 'Master carpenter specializing in custom woodworking and repairs with attention to detail. Creating beautiful, functional solutions for your home.'
  },
];

export const quotes: Quote[] = [
  {
    id: '1',
    professionalId: '1',
    professional: {
      name: 'Alex Rivera',
      profileImageUrl: 'https://images.pexels.com/photos/8961065/pexels-photo-8961065.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      rating: 4.8
    },
    diagnosisId: '1',
    diagnosisTitle: 'Kitchen Sink Leak',
    amount: '$165',
    createdAt: '2025-01-16T14:30:00Z',
    expiresAt: '2025-01-23T14:30:00Z',
    status: 'pending',
    serviceDetails: [
      'Replace P-trap assembly',
      'Check and tighten all connections',
      'Test for leaks',
      'Clean up work area'
    ],
    estimatedDuration: '1-2 hours',
    aiAnalysis: {
      fairnessRating: 'market_rate',
      confidenceScore: 0.87,
      notes: [
        'Price is within 5% of average for this repair in Portland',
        'Parts estimate is accurate',
        'Labor time estimate is reasonable'
      ]
    }
  },
  {
    id: '2',
    professionalId: '2',
    professional: {
      name: 'Sofia Chen',
      profileImageUrl: 'https://images.pexels.com/photos/3791136/pexels-photo-3791136.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      rating: 4.9
    },
    diagnosisId: '2',
    diagnosisTitle: 'Flickering Lights',
    amount: '$145',
    createdAt: '2025-02-03T10:15:00Z',
    expiresAt: '2025-02-10T10:15:00Z',
    status: 'accepted',
    serviceDetails: [
      'Inspect light fixture wiring',
      'Replace faulty connections',
      'Check circuit for other issues',
      'Test all lighting'
    ],
    estimatedDuration: '1 hour',
    aiAnalysis: {
      fairnessRating: 'market_rate',
      confidenceScore: 0.92,
      notes: [
        'Price is fair for the required electrical work',
        'Hourly rate is standard for licensed electricians in the area',
        'Scope of work is appropriate for the issue'
      ]
    }
  },
  {
    id: '3',
    professionalId: '3',
    professional: {
      name: 'Marcus Johnson',
      profileImageUrl: 'https://images.pexels.com/photos/8961156/pexels-photo-8961156.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      rating: 4.7
    },
    diagnosisId: '3',
    diagnosisTitle: 'AC Not Cooling',
    amount: '$225',
    createdAt: '2025-02-16T11:45:00Z',
    expiresAt: '2025-02-23T11:45:00Z',
    status: 'pending',
    serviceDetails: [
      'Diagnostic service',
      'Clean condenser coils',
      'Check refrigerant levels',
      'Inspect ductwork for leaks',
      'System performance test'
    ],
    estimatedDuration: '2-3 hours',
    aiAnalysis: {
      fairnessRating: 'above_market',
      confidenceScore: 0.81,
      notes: [
        'Price is 15% above average for initial AC diagnostics',
        'Service includes thorough cleaning and inspection',
        'Consider requesting itemized breakdown of costs'
      ]
    }
  }
];