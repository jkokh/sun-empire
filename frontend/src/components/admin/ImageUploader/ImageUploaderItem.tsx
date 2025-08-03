import { FunctionComponent } from 'react';
import { Button, Progress, Input } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import styles from './ImageUploader.module.sass';
import { ImageUploaderItemProps } from '@/components/admin/ImageUploader/ImageUploaderTypes.ts';

const { TextArea } = Input;

const ImageUploaderItem: FunctionComponent<ImageUploaderItemProps> = ({ file, handleRemove, handleDescriptionChange }) => {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: file.uid });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    const url = file.url || `/pictures/products/200x200/${file.response?.identifier}.jpg`;

    return (
        <div ref={setNodeRef} className={styles.sortableItem} style={style} {...attributes}>
            {file.percent !== undefined && file.percent < 100 && (
                <Progress percent={file.percent} />
            )}
            {file.percent === 100 && (
                <>
                    <div {...listeners} className={styles.imagePreview} style={{ backgroundImage: `url(${url})` }} />
                    <TextArea
                        placeholder="Enter description"
                        value={file.description}
                        onChange={(e) => handleDescriptionChange(file.uid, e.target.value)}
                        rows={2}
                        className={styles.textArea}
                    />
                    <Button icon={<DeleteOutlined />} type="text" onClick={() => handleRemove(file)} />
                </>
            )}
        </div>
    );
};

export default ImageUploaderItem;