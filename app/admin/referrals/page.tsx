async function getReferrals() {
  const res = await fetch('http://localhost:3000/api/referral', {
    cache: 'no-store',
  });

  if (!res.ok) {
    throw new Error('Failed to fetch referrals');
  }

  return res.json();
}

export default async function ReferralsPage() {
  const referrals = await getReferrals();

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Referrals Dashboard
          </h1>
          <p className="text-gray-600 mt-2">
            View all submitted referrals
          </p>
        </div>

        <div className="overflow-x-auto bg-white rounded-xl shadow border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ref ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Referrer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Facility
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Client
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Urgency
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
              </tr>
            </thead>

           <tbody className="bg-white divide-y divide-gray-200">
              {referrals.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-10 text-center text-gray-500"
                  >
                    No referrals found
                  </td>
                </tr>
              ) : (
                referrals.map((referral: any) => (
                  <tr key={referral.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                      {referral.refId}
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div>
                        <p className="font-medium">
                          {referral.referrerFullName}
                        </p>
                        <p className="text-gray-500 text-xs">
                          {referral.referrerPhone}
                        </p>
                      </div>
                    </td>

                    <td className="px-6 py-4 text-sm text-gray-900">
                      <div>
                        <p>{referral.referrerFacility}</p>
                        <p className="text-gray-500 text-xs">
                          {referral.referrerState}
                        </p>
                      </div>
                    </td>

                    <td className="px-6 py-4 text-sm text-gray-900">
                      <div>
                        <p>{referral.clientFacilityName}</p>
                        <p className="text-gray-500 text-xs">
                          {referral.clientPhone}
                        </p>
                      </div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          referral.urgencyLevel === 'High'
                            ? 'bg-red-100 text-red-700'
                            : referral.urgencyLevel === 'Medium'
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-green-100 text-green-700'
                        }`}
                      >
                        {referral.urgencyLevel}
                      </span>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(referral.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}