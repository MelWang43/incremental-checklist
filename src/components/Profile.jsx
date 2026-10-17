import { LogOut, Settings, Sun } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext'
import '../css/Profile.css'

import * as DropdownMenu from '@radix-ui/react-dropdown-menu';



function Profile({onLogOut}){
    const {user } = useAuth()

    const name = !user.user_metadata.name ? user.email : user.user_metadata.name;
    return (
        <div className="profile">


            <DropdownMenu.Root>
                <DropdownMenu.Trigger className="profile-pic btn-no-effects">
                        {name.slice(0, 1).toUpperCase()}
                    
                </DropdownMenu.Trigger>

                <DropdownMenu.Portal>
                    <DropdownMenu.Content className="options-content" 
                    sideOffset={5} 
                    align='end'
                    onClick={(e) => e.stopPropagation()}
                    >
                        <DropdownMenu.Label className="options-label centered">
                            Account
                        </DropdownMenu.Label>

                        <DropdownMenu.Separator className="options-separator"/>

                        <DropdownMenu.Label className="options-label">
                            <div className="dropdown-profile">
                                <div className="profile-pic inactive">
                                    {name.slice(0, 1).toUpperCase()}
                                </div>

                                <div style={{display: 'flex', flexDirection: 'column'}}>
                                    <span style={{fontSize: "0.9rem", color: 'white'}}>{user.user_metadata.name}</span>
                                    <span>{user.email}</span>
                                </div>
                                
                            </div>
                        </DropdownMenu.Label>

                        <DropdownMenu.Separator className="options-separator"/>

                        <DropdownMenu.Item className="options-item">
                            <Settings size={18}/>{' Settings'}
                        </DropdownMenu.Item>

                        <DropdownMenu.Item className="options-item">
                            <Sun size={18}/>{' Theme'}
                        </DropdownMenu.Item>

                        <DropdownMenu.Separator className="options-separator"/>

                        <DropdownMenu.Item className="options-item" style={{color: 'var(--delete)'}} onSelect={onLogOut}>
                            <LogOut size={18}/>{' Log out'}
                        </DropdownMenu.Item>
                    </DropdownMenu.Content>
                </DropdownMenu.Portal>
            </DropdownMenu.Root>
            
        </div>
    )
}

export default Profile