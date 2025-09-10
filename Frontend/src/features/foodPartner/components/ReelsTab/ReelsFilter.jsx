import DropdownFilter from "../../../../shared/components/ui/DropdownFilter/DropdownFilter";
import styles from "./ReelsFilter.module.css";

const ReelsFilter = ({ options, activeFilter, onFilterChange }) => {
  return (
    <div className={styles.filterWrapper}>
      <DropdownFilter
        options={options}
        activeValue={activeFilter}
        onValueChange={onFilterChange}
        placeholder="Sort Reels"
      />
    </div>
  );
};

export default ReelsFilter;
