import cx from 'classnames';
import { ReactComponent as IconBack } from 'assets/icons/icon_back.svg';
import { Link } from 'react-router-dom';

interface HeaderProps {
  isBack?: boolean;
  title?: string;
  className?: string;
  useContact?: boolean;
  useCostDelet?: boolean;
  useOrderChange?: boolean;
  useDelete?: boolean;
  onDelete?: () => void;
  useCancel?: boolean;
  onCancel?: () => void;
}

export default function Header({
  isBack,
  title,
  className,
  useContact,
  useCostDelet,
  useOrderChange,
  useDelete,
  onDelete,
  useCancel,
  onCancel,
}: HeaderProps) {
  return (
    <header className={cx('header', className)}>
      {isBack && (
        <button type="button" className="btn_back">
          <IconBack />
        </button>
      )}
      {title && <h1 className="title">{title}</h1>}
      {useContact && (
        <Link to="/" className="btn_contact">
          긴급 연락처
        </Link>
      )}
      {useCostDelet && (
        <Link to="/" className="btn_cost_delete">
          지출 삭제
        </Link>
      )}
      {useOrderChange && (
        <Link to="/" className="btn_order_change">
          순서 변경
        </Link>
      )}
      {useDelete && (
        <button type="button" className="btn_delete" onClick={onDelete}>
          삭제
        </button>
      )}
      {useCancel && (
        <Link to="/" className="btn_cancel">
          취소
        </Link>
      )}
    </header>
  );
}
