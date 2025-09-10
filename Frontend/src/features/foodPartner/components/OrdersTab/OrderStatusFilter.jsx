import { ORDER_STATUSES } from "../../constants/dashboard";
import DropdownFilter from "../../../../shared/components/ui/DropdownFilter/DropdownFilter";
import styles from "./OrderStatusFilter.module.css";

const STATUS_OPTIONS = [
  { value: "", label: "All Orders" },
  { value: ORDER_STATUSES.PENDING, label: "Pending" },
  { value: ORDER_STATUSES.CONFIRMED, label: "Confirmed" },
  { value: ORDER_STATUSES.PREPARING, label: "Preparing" },
  { value: ORDER_STATUSES.READY, label: "Ready" },
  { value: ORDER_STATUSES.DELIVERED, label: "Delivered" },
  { value: ORDER_STATUSES.CANCELLED, label: "Cancelled" },
];

const OrderStatusFilter = ({ activeFilter, onFilterChange }) => {
  return (
    <div className={styles.filterWrapper}>
      <DropdownFilter
        options={STATUS_OPTIONS}
        activeValue={activeFilter}
        onValueChange={onFilterChange}
        placeholder="Filter Orders"
      />
    </div>
  );
};

export default OrderStatusFilter;
