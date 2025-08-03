import { FunctionComponent, useEffect, useState } from 'react';
import {
    CaretDownOutlined,
    LogoutOutlined,
    SettingOutlined,
    UserOutlined,
} from '@ant-design/icons';
import { Avatar, Dropdown, Menu, MenuProps } from 'antd';
import { logoutUser } from '../../services/api';
import styles from './UserDropdownMenu.module.sass';
import { localizedUrl } from '../../misc/utils';
import { useTranslation } from 'react-i18next';

// Correct typing for menu items
const UserDropdownMenu: FunctionComponent = () => {
    const { t } = useTranslation();

    const menuItems: MenuProps['items'] = [
        {
            label: t('userDropdownMenu.userProfile'),
            key: 'profile',
            icon: <UserOutlined />,
        },
        {
            label: t('userDropdownMenu.settings'),
            key: 'settings',
            icon: <SettingOutlined />,
        },
        {
            type: 'divider',
        },
        {
            label: t('userDropdownMenu.signOut'),
            key: 'logout',
            icon: <LogoutOutlined />,
            danger: true,
        },
    ];

    const [user, setUser] = useState<string>('Guest');

    useEffect(() => {
        const userDataElement = document.getElementById('userData');
        if (userDataElement) {
            const userData = JSON.parse(userDataElement.textContent || '{}');
            setUser(`${userData.firstname} ${userData.lastname}`);
        }
    }, []);

    const handleMenuClick: MenuProps['onClick'] = (e) => {
        console.log('Menu item clicked:', e.key);
        if (e.key === 'logout') {
            logoutUser()
                .then(() => {
                    console.log('User logged out successfully');
                    setUser('');
                })
                .catch((error) => {
                    console.error('Logout failed:', error);
                })
                .finally(() => {
                    window.location.href = localizedUrl('/login');
                });
        }
    };

    return (
        <Dropdown
            overlay={
                <Menu
                    onClick={handleMenuClick}
                    items={menuItems}
                    selectedKeys={[]}
                />
            }
        >
            <span
                onClick={(e) => e.preventDefault()}
                style={{ display: 'flex', alignItems: 'center' }}
            >
                <Avatar icon={<UserOutlined />} />
                <span className={styles.user}>{user}</span>
                <CaretDownOutlined className={styles.caret} />
            </span>
        </Dropdown>
    );
};

export default UserDropdownMenu;
