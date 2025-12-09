import { ConfirmActionProps } from "../confirm-action/ConfirmAction";

interface ChainConfirmActionProps extends Omit<ConfirmActionProps, 'action'> {
  action?: () => Promise<unknown>
}

export const chainConfirm = async (
  confirm: (props: ConfirmActionProps) => void,
  actions: ChainConfirmActionProps[],

) => {
  let userAccepted = true;

  for (const action of actions) {
    if (userAccepted) {
      userAccepted = await new Promise<boolean>((resolve) => {
        confirm({
          ...action,
          action: async () => {
            action.action && await action.action();
            resolve(true);
          },
        });
      });
      await new Promise<void>((resolve) => setTimeout(resolve, 200));
    }
  }
};
