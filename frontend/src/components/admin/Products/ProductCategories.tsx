import { Tag, Tooltip } from 'antd';
import { CategoryModel } from '@tsed/prisma-models';
import { FunctionComponent } from 'react';

interface CategoryTagsProps {
    categories: CategoryModel[];
}

export const ProductCategories: FunctionComponent<CategoryTagsProps> = ({ categories }) => {
    const limit = 1;
    const visibleCategories = categories.slice(0, limit);
    const hiddenCategories = categories.slice(limit);

    const truncate = (name: string, maxLength: number) => {
        if (name.length > maxLength) {
            return `${name.substring(0, maxLength)}...`;
        }
        return name;
    };

    return (
        <div>
            {visibleCategories.map(category => (
                <Tooltip title={category.name} key={category.id}>
                    <Tag>{truncate(category.name, 10)}</Tag>
                </Tooltip>
            ))}

            {hiddenCategories.length > 0 && (
                <Tooltip
                    title={hiddenCategories.map(category => category.name).join(', ')}
                    placement="top"
                >
                    <Tag style={{ cursor: 'pointer' }}>+{hiddenCategories.length}</Tag>
                </Tooltip>
            )}
        </div>
    );
};
