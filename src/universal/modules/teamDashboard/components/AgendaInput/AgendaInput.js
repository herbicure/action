import React, {PropTypes} from 'react';
import withStyles from 'universal/styles/withStyles';
import {css} from 'aphrodite-local-styles/no-important';
import {reduxForm, Field} from 'redux-form';
import AgendaInputField from './AgendaInputField';
import Avatar from 'universal/components/Avatar/Avatar';

const AgendaInput = (props) => {
  const {agenda, handleSubmit, teamId, myTeamMember, styles} = props;
  return (
    <div className={css(styles.fieldAndAvatar)}>
      <Field
        agenda={agenda}
        name="agendaItem"
        component={AgendaInputField}
        handleSubmit={handleSubmit}
        myTeamMemberId={myTeamMember.id}
        teamId={teamId}
      />
      <div className={css(styles.author)}>
        <Avatar hasBadge={false} picture={myTeamMember.picture} size="smallest"/>
      </div>
    </div>
  );
};

AgendaInput.propTypes = {
  agenda: PropTypes.array,
  handleSubmit: PropTypes.func,
  myTeamMember: PropTypes.object,
  styles: PropTypes.object,
  teamId: PropTypes.string,
};

const styleThunk = () => ({
  author: {
    position: 'absolute',
    right: '.5rem',
    top: '.5rem',
    zIndex: 200
  },

  fieldAndAvatar: {
    position: 'relative'
  }
});

/*
 * This form's redux data is automatically cleared after it is
 * submitted.
 *
 * See: universal/redux/makeReducer.js
 */
export default reduxForm({form: 'agendaInput'})(
  withStyles(styleThunk)(AgendaInput)
);
