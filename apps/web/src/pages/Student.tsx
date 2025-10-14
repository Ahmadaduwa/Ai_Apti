import { useParams } from 'react-router-dom';
import PageHeader from '@/components/PageHeader';
import { Card, CardBody } from '@/components/Card';
import { useApi } from '@/hooks/useApi';
import type { Student as StudentType, AIProfile } from '@/types';

function AILoader() {
  return <div className="text-sm muted">Loading AI profile...</div>;
}

export default function Student() {
  const { id } = useParams<{ id: string }>();

  // Use our custom hook for cleaner data fetching
  const { data: student, loading: studentLoading } = useApi<StudentType>(`/api/students/${id}`);
  const { data: aiProfile, loading: aiLoading } = useApi<AIProfile>(`/api/students/${id}/ai-profile`);

  return (
    <div className="space-y-6">
      <PageHeader>Student Portal</PageHeader>
      
      <div className="grid md:grid-cols-3 gap-4">
        <Card>
          <CardBody>
            <div className="text-sm muted">Profile</div>
            <div className="font-semibold">Student {id}</div>
            <div className="mt-2 text-sm muted">
              {studentLoading ? 'Loading...' : `${student?.first_name} ${student?.last_name}`}
            </div>
          </CardBody>
        </Card>

        <Card className="md:col-span-2">
          <CardBody>
            <div className="font-semibold mb-2">AI Recommendations</div>
            {aiLoading ? <AILoader /> : (
              aiProfile && (
                <div>
                  <div className="text-sm muted mb-2">{aiProfile.summary}</div>
                  <div className="flex gap-2 flex-wrap">
                    {aiProfile.recommended_tracks?.map((track) => (
                      <span key={track} className="px-3 py-1 rounded-full bg-primary text-white text-sm">{track}</span>
                    ))}
                  </div>
                  <div className="text-xs muted mt-2">{aiProfile.explanation_text}</div>
                </div>
              )
            )}
          </CardBody>
        </Card>
      </div>
      
      {/* Other cards would be refactored similarly */}
    </div>
  )
}