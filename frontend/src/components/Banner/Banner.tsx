import styles from './Banner.module.sass';
import { Button } from 'antd';

export function Banner() {
    return (
        <div className={styles.container}>
            <a href="/api/users/logout">
                <Button>Logout</Button>
            </a>
        </div>
    );
}
