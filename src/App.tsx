import { useEffect, useState } from 'react';
import { fetchUsers, User } from './api';
import AutoComplete, { OptionItem } from './components/AutoComplete';

function App() {
  const [users, setUsers] = useState<OptionItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedValue, setSelectedValue] = useState<string | null>(null);

  const handleSelect = (_selectedValue: string, selectedItem: OptionItem) => {
    setSelectedValue(selectedItem?.label); 
    console.log('Selected value:', selectedValue); 
  };

  useEffect(() => {
    const loadUsers = async () => {
      setIsLoading(true);
      const data = await fetchUsers();
      setUsers(data.map((user: User) => ({ value: user.id, label: user.name })));
      setIsLoading(false);
    };

    loadUsers();
  }, []);


  return (
    <div className="App">
      {isLoading ? (
        <div>Loading users...</div>
      ) : (
        <>
          <AutoComplete data={users} onSelect={handleSelect} />
          {selectedValue && (
            <div style={{ marginTop: '20px' }}>
              <strong >Selected value:</strong> {selectedValue}
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default App
