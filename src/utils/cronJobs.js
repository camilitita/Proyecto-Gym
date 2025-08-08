// backend/src/utils/cronJobs.js
import cron from 'node-cron';
import { deactivateExpiredMembershipsService } from '../models/membershipsModel.js';

const startMembershipCronJob = () => {
  cron.schedule('0 0 * * *', async () => {
    console.log('Running scheduled task: Deactivating expired memberships...');
    try {
      // Llama a la lógica de negocio a través de un controlador o servicio
      const deactivated = await deactivateExpiredMembershipsService();

      // await handleAutomaticMembershipDeactivation(deactivated);
      console.log(`Deactivated ${deactivated.length} expired memberships.`);
    } catch (error) {
      console.error('Error in scheduled task (deactivating expired memberships):', error);
    }
  }, {
    scheduled: true,
    timezone: "America/Mexico_City"
  });
};

export default startMembershipCronJob;