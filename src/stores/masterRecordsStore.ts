import { create } from 'zustand';
import type { Network, Center, ProfessionalFamily, Department, NetworkObjective, CenterObjective } from '../types/masterRecords';
import { mockNetworks, mockCenters, mockFamilies, mockDepartments, mockObjectives } from '../data/mockMasterRecords';
import { mockODS } from '../data/mockODS';
import { mockCenterObjectives } from '../data/mockCenterObjectives';

interface MasterRecordsState {
  networks: Network[];
  centers: Center[];
  families: ProfessionalFamily[];
  departments: Department[];
  objectives: NetworkObjective[];
  centerObjectives: CenterObjective[];
  ods: NetworkObjective[];
  
  setNetworks: (networks: Network[]) => void;
  setCenters: (centers: Center[]) => void;
  setFamilies: (families: ProfessionalFamily[]) => void;
  setDepartments: (departments: Department[]) => void;
  setObjectives: (objectives: NetworkObjective[]) => void;
  setCenterObjectives: (objectives: CenterObjective[]) => void;
  setODS: (ods: NetworkObjective[]) => void;
  
  addNetwork: (network: Omit<Network, 'id' | 'centerCount'>) => void;
  updateNetwork: (id: string, network: Omit<Network, 'id' | 'centerCount'>) => void;
  deleteNetwork: (id: string) => void;
  
  addCenter: (center: Omit<Center, 'id'>) => void;
  updateCenter: (id: string, center: Omit<Center, 'id'>) => void;
  deleteCenter: (id: string) => void;
  
  addFamily: (family: Omit<ProfessionalFamily, 'id'>) => void;
  updateFamily: (id: string, family: Omit<ProfessionalFamily, 'id'>) => void;
  deleteFamily: (id: string) => void;
  
  addDepartment: (department: Omit<Department, 'id'>) => void;
  updateDepartment: (id: string, department: Omit<Department, 'id'>) => void;
  deleteDepartment: (id: string) => void;
  
  addObjective: (objective: Omit<NetworkObjective, 'id'>) => void;
  updateObjective: (id: string, objective: Omit<NetworkObjective, 'id'>) => void;
  deleteObjective: (id: string) => void;
  toggleObjectiveActive: (id: string) => void;

  addCenterObjective: (objective: Omit<CenterObjective, 'id'>) => void;
  updateCenterObjective: (id: string, objective: Omit<CenterObjective, 'id'>) => void;
  deleteCenterObjective: (id: string) => void;
  toggleCenterObjectiveActive: (id: string) => void;
  
  toggleODSActive: (id: string) => void;

  // Helper methods
  getNetworkByCode: (code: string) => Network | undefined;
  getCenterByName: (name: string) => Center | undefined;
  getDepartmentByCode: (code: string) => Department | undefined;
  getFamilyByCode: (code: string) => ProfessionalFamily | undefined;
  getObjectiveById: (id: string) => NetworkObjective | undefined;
  getCenterObjectiveById: (id: string) => CenterObjective | undefined;
}

export const useMasterRecordsStore = create<MasterRecordsState>((set, get) => ({
  networks: mockNetworks,
  centers: mockCenters,
  families: mockFamilies,
  departments: mockDepartments,
  objectives: mockObjectives,
  centerObjectives: mockCenterObjectives,
  ods: mockODS,
  
  setNetworks: (networks) => set({ networks }),
  setCenters: (centers) => set({ centers }),
  setFamilies: (families) => set({ families }),
  setDepartments: (departments) => set({ departments }),
  setObjectives: (objectives) => set({ objectives }),
  setCenterObjectives: (objectives) => set({ centerObjectives: objectives }),
  setODS: (ods) => set({ ods }),
  
  addNetwork: (network) => set((state) => ({
    networks: [...state.networks, { ...network, id: Date.now().toString(), centerCount: 0 }],
  })),
  
  updateNetwork: (id, network) => set((state) => ({
    networks: state.networks.map((n) =>
      n.id === id ? { ...n, ...network } : n
    ),
  })),
  
  deleteNetwork: (id) => set((state) => ({
    networks: state.networks.filter((n) => n.id !== id),
  })),
  
  addCenter: (center) => set((state) => ({
    centers: [...state.centers, { ...center, id: Date.now().toString() }],
    networks: state.networks.map((n) =>
      n.code === center.network
        ? { ...n, centerCount: n.centerCount + 1 }
        : n
    ),
  })),
  
  updateCenter: (id, center) => set((state) => ({
    centers: state.centers.map((c) =>
      c.id === id ? { ...c, ...center } : c
    ),
  })),
  
  deleteCenter: (id) => set((state) => {
    const center = state.centers.find((c) => c.id === id);
    if (!center) return state;

    return {
      centers: state.centers.filter((c) => c.id !== id),
      networks: state.networks.map((n) =>
        n.code === center.network
          ? { ...n, centerCount: n.centerCount - 1 }
          : n
      ),
    };
  }),
  
  addFamily: (family) => set((state) => ({
    families: [...state.families, { ...family, id: Date.now().toString() }],
  })),
  
  updateFamily: (id, family) => set((state) => ({
    families: state.families.map(( families) =>
      f.id === id ? { ...f, ...family } : f
    ),
  })),
  
  deleteFamily: (id) => set((state) => ({
    families: state.families.filter((f) => f.id !== id),
  })),
  
  addDepartment: (department) => set((state) => ({
    departments: [...state.departments, { ...department, id: Date.now().toString() }],
  })),
  
  updateDepartment: (id, department) => set((state) => ({
    departments: state.departments.map((d) =>
      d.id === id ? { ...d, ...department } : d
    ),
  })),
  
  deleteDepartment: (id) => set((state) => ({
    departments: state.departments.filter((d) => d.id !== id),
  })),
  
  addObjective: (objective) => set((state) => ({
    objectives: [...state.objectives, { ...objective, id: Date.now().toString() }],
  })),
  
  updateObjective: (id, objective) => set((state) => ({
    objectives: state.objectives.map((o) =>
      o.id === id ? { ...o, ...objective } : o
    ),
  })),
  
  deleteObjective: (id) => set((state) => ({
    objectives: state.objectives.filter((o) => o.id !== id),
  })),

  addCenterObjective: (objective) => set((state) => ({
    centerObjectives: [...state.centerObjectives, { ...objective, id: Date.now().toString() }],
  })),

  updateCenterObjective: (id, objective) => set((state) => ({
    centerObjectives: state.centerObjectives.map((o) =>
      o.id === id ? { ...o, ...objective } : o
    ),
  })),

  deleteCenterObjective: (id) => set((state) => ({
    centerObjectives: state.centerObjectives.filter((o) => o.id !== id),
  })),

  toggleObjectiveActive: (id) => set((state) => ({
    objectives: state.objectives.map((o) =>
      o.id === id ? { ...o, isActive: !o.isActive } : o
    ),
  })),

  toggleCenterObjectiveActive: (id) => set((state) => ({
    centerObjectives: state.centerObjectives.map((o) =>
      o.id === id ? { ...o, isActive: !o.isActive } : o
    ),
  })),

  toggleODSActive: (id) => set((state) => ({
    ods: state.ods.map((o) =>
      o.id === id ? { ...o, isActive: !o.isActive } : o
    ),
  })),

  // Helper methods implementation
  getNetworkByCode: (code) => {
    return get().networks.find(n => n.code === code);
  },

  getCenterByName: (name) => {
    return get().centers.find(c => c.name === name);
  },

  getDepartmentByCode: (code) => {
    return get().departments.find(d => d.code === code);
  },

  getFamilyByCode: (code) => {
    return get().families.find(f => f.code === code);
  },

  getObjectiveById: (id) => {
    return get().objectives.find(o => o.id === id);
  },

  getCenterObjectiveById: (id) => {
    return get().centerObjectives.find(o => o.id === id);
  },
}));