import React, { useState } from 'react';
import { Palette, Key, Shield, Mail, Video, MessageSquare, FolderGit2 } from 'lucide-react';
import BrandingConfig from '../components/admin/BrandingConfig';
import RegistrationCodes from '../components/admin/RegistrationCodes';
import RolesPermissions from '../components/admin/RolesPermissions';
import EmailConfig from '../components/admin/EmailConfig';
import MeetingConfig from '../components/admin/MeetingConfig';
import ChatConfig from '../components/admin/ChatConfig';
import ForumConfig from '../components/admin/ForumConfig';
import CollaborationConfig from '../components/admin/CollaborationConfig';

type TabType = 'branding' | 'codes' | 'roles' | 'email' | 'meetings' | 'chat' | 'forum' | 'collaboration';

const Admin = () => {
  const [activeTab, setActiveTab] = useState<TabType>('branding');

  const tabs = [
    { id: 'branding' as const, label: 'Personalización', icon: Palette },
    { id: 'codes' as const, label: 'Códigos de Registro', icon: Key },
    { id: 'roles' as const, label: 'Roles y Permisos', icon: Shield },
    { id: 'email' as const, label: 'Configuración de Correo', icon: Mail },
    { id: 'meetings' as const, label: 'Videoconferencias', icon: Video },
    { id: 'chat' as const, label: 'Chat', icon: MessageSquare },
    { id: 'forum' as const, label: 'Foro', icon: MessageSquare },
    { id: 'collaboration' as const, label: 'Espacio Colaborativo', icon: FolderGit2 },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">
          Administración
        </h1>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="border-b">
          <nav className="flex space-x-8 px-6" aria-label="Tabs">
            {tabs.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`
                  flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm
                  ${activeTab === id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }
                `}
              >
                <Icon className="w-5 h-5" />
                <span>{label}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'branding' && <BrandingConfig />}
          {activeTab === 'codes' && <RegistrationCodes />}
          {activeTab === 'roles' && <RolesPermissions />}
          {activeTab === 'email' && <EmailConfig />}
          {activeTab === 'meetings' && <MeetingConfig />}
          {activeTab === 'chat' && <ChatConfig />}
          {activeTab === 'forum' && <ForumConfig />}
          {activeTab === 'collaboration' && <CollaborationConfig />}
        </div>
      </div>
    </div>
  );
};

export default Admin;