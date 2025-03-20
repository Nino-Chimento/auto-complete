import { useEffect, useState } from 'react';
import { fetchUsers, User } from './api';
import AutoComplete from './components/AutoComplete';

function App() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedValue, setSelectedValue] = useState<string | null>(null);

  const handleSelect = (selectedValue: string) => {
    setSelectedValue(selectedValue); // Imposta il valore selezionato nello stato
    console.log('Selected value:', selectedValue); // Puoi fare qualsiasi cosa con questo valore
  };

  useEffect(() => {
    const loadUsers = async () => {
      setIsLoading(true);
      const data = await fetchUsers();
      setUsers(data);
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
