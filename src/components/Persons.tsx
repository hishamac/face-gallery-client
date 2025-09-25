import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { faceAPI } from '@/services/api';

interface Person {
  person_id: string;
  person_name: string;
  total_faces: number;
  total_images: number;
  thumbnail: string | null;
}

interface PersonsData {
  persons: Person[];
  total: number;
}

export default function Persons() {
  const [personsData, setPersonsData] = useState<PersonsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPersons();
  }, []);

  const fetchPersons = async () => {
    try {
      setLoading(true);
      const data = await faceAPI.getAllPersons();
      setPersonsData(data);
    } catch (err) {
      console.error('Failed to fetch persons:', err);
      setError('Failed to load persons');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading persons...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Detected Persons</h1>
        <p className="text-gray-600">Browse all detected persons and their faces</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="text-2xl font-bold">{personsData?.total || 0}</div>
            <p className="text-gray-600">Total Persons</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-2xl font-bold">
              {personsData?.persons.reduce((sum: number, person: Person) => sum + person.total_faces, 0) || 0}
            </div>
            <p className="text-gray-600">Total Faces</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-2xl font-bold">
              {personsData?.persons.reduce((sum: number, person: Person) => sum + person.total_images, 0) || 0}
            </div>
            <p className="text-gray-600">Total Images</p>
          </CardContent>
        </Card>
      </div>

      {/* Persons Grid */}
      {personsData && personsData.persons.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {personsData.persons.map((person) => (
            <Link key={person.person_id} to={`/person/${person.person_id}`}>
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-4">
                  <div className="aspect-square mb-3 bg-gray-100 rounded-lg overflow-hidden">
                    {person.thumbnail ? (
                      <img
                        src={faceAPI.getFaceUrl(person.thumbnail)}
                        alt={`${person.person_name} face`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const img = e.target as HTMLImageElement;
                          img.style.display = 'none';
                          const parent = img.parentElement;
                          if (parent) {
                            parent.innerHTML = '<div class="w-full h-full flex items-center justify-center text-gray-400">No Face</div>';
                          }
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        No Face
                      </div>
                    )}
                  </div>
                  <h3 className="font-medium text-gray-900 mb-1">{person.person_name}</h3>
                  <p className="text-sm text-gray-600">{person.total_faces} faces</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="text-gray-500 mb-4">No persons detected yet</div>
          <Button onClick={() => window.location.href = '/admin'}>
            Go to Admin to Upload Images
          </Button>
        </div>
      )}

      {/* Navigation */}
      <div className="mt-8 flex gap-4 justify-center">
        <Button variant="outline" onClick={() => window.location.href = '/'}>
          Back to Gallery
        </Button>
        <Button variant="outline" onClick={() => window.location.href = '/admin'}>
          Admin Panel
        </Button>
      </div>
    </div>
  );
}